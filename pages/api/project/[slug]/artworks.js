
import { loadArtworkImagesForProject } from '@/lib/artwork-processor';
import { processWorkData } from '@/lib/work-processor';
import { getWORKDataServer, getARTWORKDataServer } from '@/lib/notion-api-server';
import { getProjectBySlug } from '@/lib/project-data';
import { createSlug } from '@/lib/slug-utils';

export default async function handler(req, res) {
    const { slug } = req.query;

    if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
    }

    const project = getProjectBySlug(slug);
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    let artworks = [];

    // newborn-space 페이지인 경우 또는 slug에 'newborn'이 포함된 경우 artwork 데이터 가져오기
    if (slug.includes('newborn')) {
        try {
            const [workData, artworkData] = await Promise.all([
                getWORKDataServer(),
                getARTWORKDataServer()
            ]);

            const projects = processWorkData(workData);
            const projectNames = projects.map(p => p.name).filter(Boolean);

            // 현재 slug에 해당하는 Notion Project 찾기 (ID를 얻기 위함)
            const currentNotionProject = projects.find(p => createSlug(p.name) === slug)
                || projects.find(p => p.name.includes('NEWBORN') || p.name.includes('Newborn'));

            let projectId = currentNotionProject ? currentNotionProject.id : null;
            let projectName = currentNotionProject ? currentNotionProject.name : project.name;

            if (projectId) {
                // ID가 있으면 ID로 로드 (Relation 매칭)
                artworks = await loadArtworkImagesForProject(projectId, projectName, artworkData, projectNames);
            }

            if (artworks.length === 0) {
                // 찾지 못한 경우 'newborn' 키워드로 대안 찾기 (Fallback)
                const possibleNames = ['NEWBORN SPACE', '신생공NEWBORN SPACE', 'Newborn Space', 'newborn space'];
                for (const pName of possibleNames) {
                    if (slug === 'newborn-space') {
                        // 이름 매칭 ID 찾기 시도
                        const pItem = projects.find(p => p.name === pName || p.name.includes(pName));
                        const pId = pItem ? pItem.id : null;

                        // ID가 있으면 ID로, 없으면 이름으로 fallback
                        const targetId = pId || null;
                        const altArtworks = await loadArtworkImagesForProject(targetId, pName, artworkData, projectNames);

                        if (altArtworks.length > 0) {
                            artworks = altArtworks;
                            break;
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching project artworks:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    res.status(200).json({ artworks });
}
