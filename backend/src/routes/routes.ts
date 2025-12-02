// backend/src/routes/routes.ts
import express from "express";
import doctorRoutes from "./doctor.routes";
import adminRoutes from "./admin.routes";
import labRoutes from "./lab.routes";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import rolesRoutes from "./roles.routes";
import privilegesRoutes from "./privileges.routes";
import appointmentsRoutes from "./appointments.routes";
import notesRouter from "./notes.routes";
import forumsRoutes from "./forums.routes";
import patientRoutes from "./patients.routes";
import clinicalHistoryRoutes from "./clinicalHistory.routes";
import reportRouter from "./report.routes";
import historialRoutes from "./historial.routes";
import historyRoutes from "./history.routes";
import agendaRoutes from "./agenda.routes";
import appointmentRoutes from "./appointment.routes";
import expedienteRoutes from "./expediente.routes";
import analysisRoutes from "./analysis.routes";
import dashboardRoutes from "./dashboard.routes";
import profileRoutes from "./profile.routes";
const router = express.Router();


// ============================================
// Authentication Routes (Public)
// ============================================
router.use("/auth", authRoutes);

// ============================================
// Profile Routes (Protected)
// ============================================
router.use("/profile", profileRoutes);

// ============================================
// User Routes (Protected)
// ============================================
router.use("/users", usersRoutes);

// ============================================
// Clinical History Routes (Protected)
// ============================================
router.use("/clinical-history", clinicalHistoryRoutes);

// ============================================
// Role Routes (Protected)
// ============================================
router.use("/roles", rolesRoutes);

// ============================================
// Privilege Routes (Protected)
// ============================================
router.use("/privileges", privilegesRoutes);

// ============================================
// Forum Routes (Protected)
// ============================================
router.use("/forums", forumsRoutes);

// ============================================
// Laboratory Routes (Protected)
// ============================================
router.use("/laboratory", labRoutes);

// ============================================
// Report Routes (Protected)
// ============================================
router.use("/report", reportRouter);

// ============================================
// Notes Routes (Protected)
// ============================================
router.use("/notes", notesRouter);

// ============================================
// Patients Routes (Protected)
// ============================================
router.use("/patients", patientRoutes);

// Expediente Routes (Protected)
// ============================================
router.use("/patients", expedienteRoutes);

// ============================================
// Patient History Questions Templates
// ============================================
router.use("/history", historyRoutes);

// ============================================
// Agenda Routes
// ============================================
router.use("/agenda", agendaRoutes);

// ============================================
// Appointments Routes (Protected)
// ============================================
router.use("/appointments", appointmentRoutes);

// ============================================
// Appointments Routes (Protected)
// ============================================
router.use("/appointments", appointmentRoutes);

// ============================================
// Historial Routes (Patient Analysis History)
// ============================================
router.use("/historial", historialRoutes);

// Appointments Routes (Protected)
// ============================================
router.use("/appointments", appointmentsRoutes);

// ============================================
// Analysis Routes (Protected)
// ============================================
router.use("/analysis", analysisRoutes);

// ============================================
// Doctors Routes (Protected)
// ============================================
router.use("/doctors", doctorRoutes);

// ============================================
// Doctors Routes (Protected)
// ============================================
router.use("/update-dashboard", dashboardRoutes);
// Admin Routes (Protected)
// ============================================
router.use("/admins", adminRoutes);

export default router;
