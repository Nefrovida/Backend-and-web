import { Request, Response } from "express";
import Report from "../../model/report.model";
import path from "path";
import fs from "fs";

export const downloadReport = async (req: Request, res: Response) => {
    try {
        const idParam = req.query.id;

        if (!idParam) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "MISSING_PARAMETER",
                    message: "id query parameter is required",
                },
            });
        }

        const id = Number(idParam);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "INVALID_ID",
                    message: "Analysis ID must be a valid number",
                },
            });
        }

        // Get the result record
        const result = await Report.getResult(id);

        if (!result) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "RESULT_NOT_FOUND",
                    message: "No result found for this analysis ID",
                },
            });
        }

        if (!result.path) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "FILE_PATH_MISSING",
                    message: "PDF file path not found for this result",
                },
            });
        }

        // Extract filename from the path (handles URLs and file paths)
        let filename = result.path.trim();
        try {
            // Try to parse as URL
            const url = new URL(filename);
            // Extract filename from URL pathname
            filename = path.basename(url.pathname);
        } catch (e) {
            // Not a URL, extract filename from path
            filename = path.basename(filename);
        }

        const uploadDir = path.join(process.cwd(), "uploads");
        const filePath = path.join(uploadDir, filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error(`PDF file not found at: ${filePath}`);
            return res.status(404).json({
                success: false,
                error: {
                    code: "FILE_NOT_FOUND",
                    message: "PDF file not found on server",
                },
            });
        }

        // Set content type for PDF
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

        // Send the file
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error("Error sending PDF file:", err);
                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        error: {
                            code: "STREAM_ERROR",
                            message: "Error serving PDF file",
                        },
                    });
                }
            }
        });
    } catch (error) {
        console.error("Error in downloadReport controller:", error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: {
                    code: "INTERNAL_ERROR",
                    message: "An unexpected error occurred",
                },
            });
        }
    }
};
