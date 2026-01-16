import { getExhibitionSecondaryData } from '../../../../lib/exhibition-detail-processor';

export default async function handler(req, res) {
    const { slug } = req.query;

    if (!slug) {
        return res.status(400).json({ message: 'Slug is required' });
    }

    try {
        const data = await getExhibitionSecondaryData(slug);
        res.status(200).json(data);
    } catch (error) {
        console.error(`Error fetching related data for slug ${slug}:`, error);
        res.status(500).json({ message: 'Error fetching related data' });
    }
}
