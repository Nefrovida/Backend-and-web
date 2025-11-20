import { type Request, type Response } from "express";
import Laboratory from "#/src/model/lab.model";
import User from "#/src/model/user.model";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export const getFullLabResults = async (req: Request, res: Response) => {
    try {
        // console.log("inside get full lab results")
        const patient_analysis_id = req.query.patient_analysis_id;
        // console.log("patient_analysis_id: ", patient_analysis_id);

        // Validate that it's present
        if (!patient_analysis_id) {
            return res.status(400).json({ 
                success: false, 
                message: "patient_analysis_id is required" 
            });
        }

        // console.log("id: ", patient_analysis_id);
        const id = Number(patient_analysis_id);
        
        if (isNaN(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "patient_analysis_id must be a valid number" 
            });
        }

        // Queries
        const fullLabResults = await Laboratory.getFullLabResults(id);
        // console.log("full results: ", fullLabResults);
        if (!fullLabResults.analysis?.patient_id || typeof fullLabResults.analysis?.patient_id !== "string") {
            return res.status(400).json({ 
                success: false, 
                message: "patient_id is required" 
            });
        }
        const user = await User.getUserByPatientId(fullLabResults.analysis?.patient_id);
        // console.log("user found for this analysis: ", user);

        const response = {
            user: user,
            analysis: fullLabResults.analysis,
            results: fullLabResults.results
        };

        res.status(200).json({ success: true, data: response });
    } catch (error) {
        console.error("Error in getFullLabResults controller: ", error);
        res.status(400).json({ success: false, message: "Unable to get full lab results of user" });
    }
}

export const getResultsPDF = async (req: Request, res: Response) => {
    try {
        // console.log("inside get results pdf")
        const results_id = req.query.results_id;
        // console.log("results_id: ", results_id);

        // Validate that it's present
        if (!results_id) {
            return res.status(400).json({ 
                success: false, 
                message: "results_id is required" 
            });
        }

        const id = Number(results_id);
        
        if (isNaN(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "results_id must be a valid number" 
            });
        }

        // Get the results record to find the file path
        const results = await prisma.results.findUnique({
            where: { result_id: id }
        });

        if (!results) {
            return res.status(404).json({ 
                success: false, 
                message: "Results not found" 
            });
        }

        if (!results.path) {
            return res.status(404).json({ 
                success: false, 
                message: "PDF file path not found for this result" 
            });
        }

        console.log(`Database path value: "${results.path}"`);

        // Extract filename from the path (handles URLs and file paths)
        let filename = results.path.trim();
        
        try {
            // Try to parse as URL
            const url = new URL(filename);
            // Extract filename from URL pathname
            filename = path.basename(url.pathname);
        } catch (e) {
            // Not a URL, extract filename from path
            filename = path.basename(filename);
        }

        console.log(`Extracted filename: ${filename}`);

        const uploadDir = path.join(process.cwd(), "uploads");
        const filePath = path.join(uploadDir, filename);

        console.log(`Resolved file path: ${filePath}`);
        console.log(`Upload directory: ${uploadDir}`);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error(`PDF file not found at: ${filePath}`);
            console.error(`Current working directory: ${process.cwd()}`);
            return res.status(404).json({ 
                success: false, 
                message: `PDF file not found on server. Expected path: ${filePath}` 
            });
        }

        // Set content type for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        
        // Send the file
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error("Error sending PDF file:", err);
                if (!res.headersSent) {
                    res.status(500).json({ 
                        success: false, 
                        message: "Error serving PDF file" 
                    });
                }
            }
        });
    } catch (error) {
        console.error("Error in getResultsPDF controller: ", error);
        if (!res.headersSent) {
            res.status(500).json({ 
                success: false, 
                message: "Unable to get results PDF" 
            });
        }
    }
};