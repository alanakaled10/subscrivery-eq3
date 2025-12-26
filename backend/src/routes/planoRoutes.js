import express from 'express';
import db from '../config/db.js'; 
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM plano");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});
export default router;