import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, PiggyBank } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GoalCard from "@/components/dashboard/GoalCard";

export default function Cofres() {
  const { goals, addGoal, addToGoal } = useFinance();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.targetAmount || !formData.targetDate) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    addGoal({
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      targetDate: formData.targetDate,
    });

    toast({
      title: "Sucesso!",
      description: "Meta criada com sucesso.",
    });

    setFormData({
      name: "",
      targetAmount: "",
      targetDate: "",
    });
    setIsDialogOpen(false);
  };

  const handleAddMoney = (goalId: string) => {
    setSelectedGoalId(goalId);
  };

  const confirmAddMoney = () => {
    if (selectedGoalId && addAmount) {
      const amount = parseFloat(addAmount);
      if (!isNaN(amount) && amount > 0) {
        addToGoal(selectedGoalId, amount);
        toast({
          title: "Sucesso!",
          description: `R$ ${amount.toFixed(2)} adicionado à meta!`,
        });
        setSelectedGoalId(null);
        setAddAmount("");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cofres</h1>
          <p className="text-muted-foreground">
            Gerencie suas metas de economia
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cofre
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
              <PiggyBank className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Nenhum cofre criado</h3>
            <p className="text-muted-foreground">
              Crie metas de economia para realizar seus sonhos e objetivos financeiros.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onAddMoney={handleAddMoney} />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cofre</DialogTitle>
            <DialogDescription>
              Crie uma nova meta de economia para alcançar seus objetivos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Meta</Label>
              <Input
                id="name"
                placeholder="Ex: Viagem para Europa, Carro Novo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Valor Total (R$)</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetDate">Data Alvo</Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedGoalId !== null} onOpenChange={() => setSelectedGoalId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Dinheiro ao Cofre</DialogTitle>
            <DialogDescription>
              Quanto você deseja adicionar a este cofre?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedGoalId(null)}>
              Cancelar
            </Button>
            <Button onClick={confirmAddMoney}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
