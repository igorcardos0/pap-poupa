import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Configuracoes() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize sua experiência
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Aparência</h3>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Tema</p>
                <p className="text-sm text-muted-foreground">
                  {theme === "dark" ? "Modo Escuro" : "Modo Claro"}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre</h3>
            <div className="p-4 border rounded-lg space-y-2">
              <p className="text-sm">
                <span className="font-medium">Versão:</span> 1.0.0
              </p>
              <p className="text-sm text-muted-foreground">
                Pap, Poupa! - Gestão Financeira Pessoal
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
