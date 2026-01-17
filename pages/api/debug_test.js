import fs from 'fs';
import path from 'path';
import { getDatabaseMetadataServer, getPageBlocksServer, getBlockChildrenServer } from '../../lib/notion-api-server';

export default async function handler(req, res) {
    try {
        const log = [];
        const addLog = (msg) => {
            console.log(msg);
            log.push(msg);
        };

        addLog('Starting Debug Process...');

        // 1. WORK DB의 상위 페이지(Web DB) ID 알아내기
        const workDbMeta = await getDatabaseMetadataServer('WORK');
        if (!workDbMeta) {
            addLog('Failed to fetch WORK DB metadata.');
            return res.status(500).json({ error: 'DB Meta Failed', log });
        }

        if (!workDbMeta.parent || workDbMeta.parent.type !== 'page_id') {
            addLog(`WORK DB Parent is not a page. Parent: ${JSON.stringify(workDbMeta.parent)}`);
            return res.status(500).json({ error: 'Parent is not a page', log });
        }

        const parentPageId = workDbMeta.parent.page_id;
        addLog(`Web DB Page ID Found: ${parentPageId}`);

        // 2. 상위 페이지의 블록 가져오기
        const blocks = await getPageBlocksServer(parentPageId);
        if (!blocks || blocks.length === 0) {
            addLog('No blocks found in Web DB page.');
            return res.status(500).json({ error: 'No blocks', log });
        }

        addLog(`Fetched ${blocks.length} blocks from parent page.`);

        // 3. "Artist Statement" 헤딩 찾기
        let targetText = '';
        let foundHeading = false;

        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (['heading_1', 'heading_2', 'heading_3'].includes(block.type)) {
                const richText = block[block.type]?.rich_text;
                if (richText && richText.length > 0) {
                    const text = richText.map(t => t.plain_text).join('').trim().toLowerCase();
                    addLog(`Checking Heading: "${text}"`);

                    if (text === 'artist statement') {
                        foundHeading = true;
                        addLog('Target heading found!');

                        // 다음 블록 확인
                        const nextBlock = blocks[i + 1];
                        if (nextBlock) {
                            addLog(`Next block type: ${nextBlock.type}`);

                            if (nextBlock.type === 'column_list') {
                                const columns = await getBlockChildrenServer(nextBlock.id);
                                addLog(`Found ${columns.length} columns.`);

                                if (columns.length > 0) {
                                    const firstCol = columns[0];
                                    const colBlocks = await getBlockChildrenServer(firstCol.id);

                                    for (const cb of colBlocks) {
                                        if (cb.type === 'paragraph') {
                                            const t = cb.paragraph.rich_text.map(rt => rt.plain_text).join('');
                                            targetText += t + '\n';
                                        }
                                    }
                                }
                            } else {
                                addLog('Next block is not a column_list. Checking for text...');
                                if (nextBlock.type === 'paragraph') {
                                    targetText += nextBlock.paragraph.rich_text.map(rt => rt.plain_text).join('') + '\n';
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }

        if (!foundHeading) {
            addLog('Heading "Artist Statement" not found.');
        }

        // 파일 저장
        const outputPath = path.join(process.cwd(), 'debug_artist_statement.txt');
        fs.writeFileSync(outputPath, `Debug Run Time: ${new Date().toISOString()}\n\nLog:\n${log.join('\n')}\n\nExtracted Text:\n${targetText}`);
        addLog(`Saved output to ${outputPath}`);

        res.status(200).json({ success: true, extractedText: targetText, log });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
