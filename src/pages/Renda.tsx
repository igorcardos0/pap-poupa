import { useState } from "react";
import { useFinance, Income } from "@/contexts/FinanceContext";
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
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Renda() {
  const { incomes, addIncome, deleteIncome } = useFinance();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "fixa" as "fixa" | "variavel",
    isRecurring: false,
  });

  const handleSubmit = () => {
    if (!formData.description || !formData.amount) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    addIncome({
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      isRecurring: formData.isRecurring,
    });

    toast({
      title: "Sucesso!",
      description: "Receita adicionada com sucesso.",
    });

    setFormData({
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "fixa",
      isRecurring: false,
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteIncome(id);
    toast({
      title: "Removido",
      description: "Receita removida com sucesso.",
    });
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Receitas</h1>
          <p className="text-muted-foreground">
            Total: R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Receita
        </Button>
      </div>

      {incomes.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 bg-success/10 rounded-full w-fit mx-auto">
              <TrendingUp className="h-12 w-12 text-success" />
            </div>
            <h3 className="text-2xl font-bold">Nenhuma receita cadastrada</h3>
            <p className="text-muted-foreground">
              Comece adicionando suas fontes de renda para ter controle total das suas finanças.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {incomes.map((income) => (
            <Card key={income.id} className="p-4 hover:shadow-lg-custom transition-all">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{income.description}</h3>
                    {income.isRecurring && (
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        Recorrente
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{new Date(income.date).toLocaleDateString("pt-BR")}</span>
                    <span className="capitalize">{income.category}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold text-success">
                    + R$ {income.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(income.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Receita</DialogTitle>
            <DialogDescription>
              Adicione uma nova fonte de renda ao seu controle financeiro.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Ex: Salário, Freelance, etc."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as "fixa" | "variavel" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixa">Fixa</SelectItem>
                  <SelectItem value="variavel">Variável</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
              />
              <Label htmlFor="recurring">Receita recorrente</Label>
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
