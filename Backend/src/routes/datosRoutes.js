import express from "express";
import { guardarDato } from "../controllers/datosController.js";

const router = express.Router();

router.post("/datos", guardarDato);

export default router;
