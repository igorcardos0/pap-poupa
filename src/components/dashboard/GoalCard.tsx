import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { Goal } from "@/contexts/FinanceContext";

type GoalCardProps = {
  goal: Goal;
  onAddMoney: (goalId: string) => void;
};

export default function GoalCard({ goal, onAddMoney }: GoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const isCompleted = progress >= 100;

  return (
    <Card className="p-6 shadow-card hover:shadow-lg-custom transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isCompleted ? "bg-success/10" : "bg-primary/10"}`}>
              <Target className={`h-5 w-5 ${isCompleted ? "text-success" : "text-primary"}`} />
            </div>
            <div>
              <h3 className="font-semibold">{goal.name}</h3>
              <p className="text-sm text-muted-foreground">
                Meta: {new Date(goal.targetDate).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              R$ {goal.currentAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-muted-foreground">
              de R$ {goal.targetAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {!isCompleted && (
          <Button
            onClick={() => onAddMoney(goal.id)}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Adicionar Dinheiro
          </Button>
        )}
        {isCompleted && (
          <div className="text-center py-2 px-4 bg-success/10 rounded-lg">
            <p className="text-sm font-medium text-success">🎉 Meta Atingida!</p>
          </div>
        )}
      </div>
    </Card>
  );
}
