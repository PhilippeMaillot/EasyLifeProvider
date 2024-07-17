const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

class SqlController {
    static generateSql = async (req, res) => {
        const prompt = req.body.prompt + "\nGénère uniquement une requête SQL préparée sans texte supplémentaire.";
        try {
            const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
                prompt: prompt,
                max_tokens: 150,
                n: 1,
                stop: ["\n"]
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            const sqlQuery = response.data.choices[0].text.trim();
            res.json({ sql: sqlQuery });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la génération de la requête SQL');
        }
    };
}

module.exports = SqlController;
