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
import { Plus, Trash2, Target, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Planejamento() {
  const { debts, addDebt, deleteDebt } = useFinance();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    totalAmount: "",
    remainingInstallments: "",
    installmentValue: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.totalAmount || !formData.remainingInstallments || !formData.installmentValue) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    addDebt({
      name: formData.name,
      totalAmount: parseFloat(formData.totalAmount),
      remainingInstallments: parseInt(formData.remainingInstallments),
      installmentValue: parseFloat(formData.installmentValue),
    });

    toast({
      title: "Sucesso!",
      description: "Dívida adicionada com sucesso.",
    });

    setFormData({
      name: "",
      totalAmount: "",
      remainingInstallments: "",
      installmentValue: "",
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteDebt(id);
    toast({
      title: "Removido",
      description: "Dívida removida com sucesso.",
    });
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.totalAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Planejamento</h1>
        <p className="text-muted-foreground">
          Gerencie suas dívidas e parcelamentos
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-card to-primary/5">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-warning/10 rounded-full">
            <AlertCircle className="h-8 w-8 text-warning" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Dívida Total</h3>
            <p className="text-3xl font-bold text-warning">
              R$ {totalDebt.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Controle de Dívidas</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Dívida
        </Button>
      </div>

      {debts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 bg-success/10 rounded-full w-fit mx-auto">
              <Target className="h-12 w-12 text-success" />
            </div>
            <h3 className="text-2xl font-bold">Nenhuma dívida registrada</h3>
            <p className="text-muted-foreground">
              Parabéns! Você não tem dívidas ou parcelamentos registrados.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {debts.map((debt) => (
            <Card key={debt.id} className="p-6 hover:shadow-lg-custom transition-all">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{debt.name}</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Valor Total</p>
                      <p className="font-bold text-warning">
                        R$ {debt.totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Parcelas Restantes</p>
                      <p className="font-bold">{debt.remainingInstallments}x</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valor da Parcela</p>
                      <p className="font-bold">
                        R$ {debt.installmentValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(debt.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Dívida</DialogTitle>
            <DialogDescription>
              Registre um parcelamento, empréstimo ou fatura de cartão.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Descrição</Label>
              <Input
                id="name"
                placeholder="Ex: Cartão de Crédito, Financiamento"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Valor Total (R$)</Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remainingInstallments">Parcelas Restantes</Label>
              <Input
                id="remainingInstallments"
                type="number"
                placeholder="12"
                value={formData.remainingInstallments}
                onChange={(e) => setFormData({ ...formData, remainingInstallments: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="installmentValue">Valor da Parcela (R$)</Label>
              <Input
                id="installmentValue"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.installmentValue}
                onChange={(e) => setFormData({ ...formData, installmentValue: e.target.value })}
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
