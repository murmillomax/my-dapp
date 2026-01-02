import { useEffect, useState } from "react";
import { Counter } from "counterapi";

// Workspace correcto
const counter = new Counter({ workspace: "roman-alexander-fernandez-rochas-team-2349" });

export default function Visitas() {
  const [visitas, setVisitas] = useState("Cargando...");

  async function registrarVisita() {
    try {
      const result = await counter.up("first-counter-2349"); 
      console.log("Respuesta completa:", result);
      // Solo guardamos el número de visitas
      setVisitas(result.data.up_count);
    } catch (error) {
      console.error("Error con CounterAPI:", error.message);
      setVisitas("Error");
    }
  }

  // Llamada automática al montar el componente
  useEffect(() => {
    registrarVisita();
  }, []);

  return (
    <div style={{ position: "fixed", top: 10, right: 10, background: "#eee", padding: "5px", borderRadius: "5px" }}>
      Visitas: {visitas}
    </div>
  );
}



