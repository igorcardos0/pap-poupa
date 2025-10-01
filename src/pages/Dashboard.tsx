import { useMemo } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import StatCard from "@/components/dashboard/StatCard";
import GoalCard from "@/components/dashboard/GoalCard";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Bell, Calendar, Target, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Dashboard() {
  const { incomes, expenses, goals, addToGoal, getMonthlyStats } = useFinance();
  const { toast } = useToast();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState("");

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyStats = getMonthlyStats();

  const stats = useMemo(() => {
    const monthlyIncomes = incomes.filter((income) => {
      const date = new Date(income.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const monthlyExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalIncome = monthlyIncomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpense;

    const fixedExpenses = monthlyExpenses
      .filter((e) => e.category === "fixa")
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      balance,
      totalIncome,
      totalExpense,
      fixedExpenses,
      fixedExpensePercentage: totalIncome > 0 ? (fixedExpenses / totalIncome) * 100 : 0,
    };
  }, [incomes, expenses, currentMonth, currentYear]);

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

  const alerts = useMemo(() => {
    const alertsList = [];
    
    if (stats.fixedExpensePercentage > 50) {
      alertsList.push({
        type: "warning",
        message: `Alerta: Seus gastos fixos ultrapassaram 50% da sua renda mensal! (${stats.fixedExpensePercentage.toFixed(0)}%)`,
      });
    }

    goals.forEach((goal) => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      if (progress >= 100) {
        alertsList.push({
          type: "success",
          message: `Parabéns! Você atingiu a meta do cofre "${goal.name}"!`,
        });
      }
    });

    return alertsList;
  }, [stats.fixedExpensePercentage, goals]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="p-4 border-primary/50 bg-primary/5">
          <div className="flex items-start space-x-3">
            <Bell className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold">Notificações</h3>
              {alerts.map((alert, index) => (
                <p
                  key={index}
                  className={`text-sm ${
                    alert.type === "success" ? "text-success" : "text-warning"
                  }`}
                >
                  {alert.message}
                </p>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Saldo Real Disponível"
          value={`R$ ${monthlyStats.availableBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          icon={Wallet}
          variant={monthlyStats.availableBalance >= 0 ? "success" : "destructive"}
        />
        <StatCard
          title="Receitas do Mês"
          value={`R$ ${monthlyStats.totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Despesas do Mês"
          value={`R$ ${monthlyStats.totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          icon={TrendingDown}
          variant="destructive"
        />
        <StatCard
          title="Projeção Final do Mês"
          value={`R$ ${monthlyStats.projectedEndBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          variant={monthlyStats.projectedEndBalance >= 0 ? "success" : "destructive"}
        />
      </div>

      {/* Additional Monthly Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-warning/50 bg-warning/5">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Gastos Hoje</p>
              <p className="text-2xl font-bold">
                R$ {monthlyStats.todayExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-destructive/50 bg-destructive/5">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Dívidas do Mês</p>
              <p className="text-2xl font-bold">
                R$ {monthlyStats.monthlyDebts.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-primary/50 bg-primary/5">
          <div className="flex items-center space-x-3">
            <Target className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Meta Mensal Cofres</p>
              <p className="text-2xl font-bold">
                R$ {monthlyStats.monthlyGoals.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Goals */}
      {goals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Meus Cofres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onAddMoney={handleAddMoney} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && incomes.length === 0 && expenses.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
              <Wallet className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Bem-vindo ao Pap, Poupa!</h3>
            <p className="text-muted-foreground">
              Comece adicionando suas receitas, despesas e metas de economia usando o menu de navegação acima.
            </p>
          </div>
        </Card>
      )}

      {/* Add Money Dialog */}
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
