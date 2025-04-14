import React, { useState } from "react";
import { Sparkles, Mail } from "lucide-react";
import { supabase } from "./supabase";
import type { PostgrestError } from "./types/supabase";

function App() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("emailtonotify")
        .insert([{ email }]);

      if (error) {
        const pgError = error as PostgrestError;
        if (pgError.code === "23505") {
          // Unique violation
          throw new Error("Este e-mail já está registrado");
        }
        throw error;
      }

      setSubmitStatus("success");
      setEmail("");
    } catch (error) {
      // console.error('Error saving email:', error);
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Ocorreu um erro inesperado"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl">
        <div className="flex items-center justify-center mb-8">
          <Sparkles className="w-12 h-12 text-blue-400 mr-3" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Lumexis Solutions
          </h1>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-200 mb-4">
            Algo incrível está chegando em breve
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Estamos trabalhando duro para trazer soluções inovadoras que vão
            transformar a forma como você faz negócios. <br />
            Fique ligado para o nosso lançamento!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-900 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu email"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-blue-900 placeholder-blue-400"
                required
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200`}
            >
              {isSubmitting ? "Enviandp..." : "Notifica-me"}
            </button>
          </div>
          {submitStatus === "success" && (
            <p className="mt-3 text-green-300 text-center">
              Obrigado pelo seu interesse! Vamos te avisar quando lançarmos.
            </p>
          )}
          {submitStatus === "error" && (
            <p className="mt-3 text-red-300 text-center">
              {errorMessage ||
                "Houve um erro ao salvar seu e-mail. Por favor, tente novamente."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
