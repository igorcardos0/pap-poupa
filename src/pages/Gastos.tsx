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
import { Plus, Trash2, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Gastos() {
  const { expenses, addExpense, deleteExpense } = useFinance();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "variavel" as "fixa" | "variavel" | "diaria" | "extraordinaria",
    tags: "",
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

    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

    addExpense({
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      tags: tags.length > 0 ? tags : undefined,
    });

    toast({
      title: "Sucesso!",
      description: "Despesa adicionada com sucesso.",
    });

    setFormData({
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "variavel",
      tags: "",
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
    toast({
      title: "Removido",
      description: "Despesa removida com sucesso.",
    });
  };

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Despesas</h1>
          <p className="text-muted-foreground">
            Total: R$ {totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Despesa
        </Button>
      </div>

      {expenses.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto">
              <ShoppingCart className="h-12 w-12 text-destructive" />
            </div>
            <h3 className="text-2xl font-bold">Nenhuma despesa cadastrada</h3>
            <p className="text-muted-foreground">
              Adicione seus gastos para ter controle total de para onde seu dinheiro está indo.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <Card key={expense.id} className="p-4 hover:shadow-lg-custom transition-all">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="font-semibold">{expense.description}</h3>
                  <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>{new Date(expense.date).toLocaleDateString("pt-BR")}</span>
                    <span className="capitalize">{expense.category}</span>
                    {expense.tags && expense.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold text-destructive">
                    - R$ {expense.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(expense.id)}
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
            <DialogTitle>Nova Despesa</DialogTitle>
            <DialogDescription>
              Registre um novo gasto no seu controle financeiro.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Ex: Supermercado, Aluguel, etc."
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
                  setFormData({ ...formData, category: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixa">Fixa</SelectItem>
                  <SelectItem value="variavel">Variável</SelectItem>
                  <SelectItem value="diaria">Diária</SelectItem>
                  <SelectItem value="extraordinaria">Extraordinária</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                placeholder="Ex: alimentação, lazer, transporte"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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
