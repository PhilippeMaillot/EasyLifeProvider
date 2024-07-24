require('dotenv').config();
const axios = require('axios');
//import OpenAI from "openai";
const sqlModel = require('../models/sqlModel')

/*
const openai = new OpenAI({
    organization: process.env.ORG_ID,
    project: process.env.PROJECT_ID,
});

const apiKey = process.env.OPENAI_API_KEY;
*/

class SqlController {
/*  static generateSql = async (req, res) => {
        const prompt = req.body.prompt + "\nGénère uniquement une requête SQL préparée sans texte supplémentaire.";
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
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

    static testingApi = async () => {
        const stream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Say this is a test" }],
            stream: true,
        });
        for await (const chunk of stream) {
            process.stdout.write(chunk.choices[0]?.delta?.content || "");
        }
    }
*/
    static saveQuery = async (req, res) => {
        try {
            const data = req.body;
            await sqlModel.save(data, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(201).json(results);
            });
        } catch {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    static deleteQueries = async (req, res) => {
        try {
            const tableName = req.params;
            await sqlModel.cleanUp(tableName, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(201).json(results);
            });
        } catch {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    static deleteOneQuery = async (req, res) => {
        try {
            const queryId = req.params;
            await sqlModel.delete(queryId, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(201).json(results);
            });
        } catch {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    static getQueriesForTableName = async (req, res) => {
        try {
            const tableName = req.params;
            await sqlModel.getQueriesForTableName(tableName, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(200).json(results);
            });
        } catch {
            res.status(500).json({ error: 'An error occured'});
        }
    }
}

module.exports = SqlController;
