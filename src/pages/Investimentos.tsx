import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, LineChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Investimentos() {
  const { investments, addInvestment, deleteInvestment } = useFinance();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "renda-fixa" as "renda-fixa" | "acoes" | "fiis" | "cripto",
    name: "",
    currentValue: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.currentValue) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    addInvestment({
      type: formData.type,
      name: formData.name,
      currentValue: parseFloat(formData.currentValue),
    });

    toast({
      title: "Sucesso!",
      description: "Investimento adicionado com sucesso.",
    });

    setFormData({
      type: "renda-fixa",
      name: "",
      currentValue: "",
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteInvestment(id);
    toast({
      title: "Removido",
      description: "Investimento removido com sucesso.",
    });
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.currentValue, 0);

  const typeLabels = {
    "renda-fixa": "Renda Fixa",
    acoes: "Ações",
    fiis: "FIIs",
    cripto: "Criptomoedas",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investimentos</h1>
          <p className="text-muted-foreground">
            Total Investido: R$ {totalInvested.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Investimento
        </Button>
      </div>

      {investments.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
              <LineChart className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Nenhum investimento registrado</h3>
            <p className="text-muted-foreground">
              Registre seus investimentos para acompanhar a evolução do seu patrimônio.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investments.map((investment) => (
            <Card key={investment.id} className="p-6 hover:shadow-lg-custom transition-all">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {typeLabels[investment.type]}
                    </span>
                    <h3 className="font-semibold text-lg">{investment.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(investment.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Valor Atual</p>
                  <p className="text-2xl font-bold text-success">
                    R$ {investment.currentValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Investimento</DialogTitle>
            <DialogDescription>
              Registre um investimento no seu portfólio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Ativo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renda-fixa">Renda Fixa</SelectItem>
                  <SelectItem value="acoes">Ações</SelectItem>
                  <SelectItem value="fiis">FIIs</SelectItem>
                  <SelectItem value="cripto">Criptomoedas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Ativo</Label>
              <Input
                id="name"
                placeholder="Ex: Tesouro Direto, PETR4, etc."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentValue">Valor Atual (R$)</Label>
              <Input
                id="currentValue"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
