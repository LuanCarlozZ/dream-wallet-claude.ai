import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Fuel,
  Gift,
  Home,
  Landmark,
  Plus,
  ReceiptText,
  ShieldCheck,
  Trash2,
  WalletCards,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  currency,
  FinanceData,
  loadFinanceData,
  makeId,
  monthKey,
  monthLabel,
  moveMonth,
  saveFinanceData,
  totalsForMonth,
} from "@/lib/finance-store";
import { toast } from "sonner";

type Tab = "home" | "bills" | "wishes";

const MONTH_STORAGE_KEY = "fincontrol-selected-month";
const billSuggestions = ["Aluguel", "Combustível", "Manutenção", "Internet", "MEI"];

const Index = () => {
  const [data, setData] = useState<FinanceData>(() => loadFinanceData());
  const [month, setMonth] = useState(() => localStorage.getItem(MONTH_STORAGE_KEY) || monthKey());
  const [tab, setTab] = useState<Tab>("home");
  const [week, setWeek] = useState("1");
  const [earningAmount, setEarningAmount] = useState("");
  const [billName, setBillName] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [wishName, setWishName] = useState("");
  const [wishAmount, setWishAmount] = useState("");

  useEffect(() => saveFinanceData(data), [data]);
  useEffect(() => localStorage.setItem(MONTH_STORAGE_KEY, month), [month]);

  const totals = useMemo(() => totalsForMonth(data, month), [data, month]);
  const monthEarnings = data.earnings.filter((item) => item.month === month).sort((a, b) => a.week - b.week);
  const monthBills = data.bills.filter((item) => item.month === month);
  const weeklyChart = [1, 2, 3, 4, 5].map((number) => ({
    name: `S${number}`,
    valor: monthEarnings.find((item) => item.week === number)?.amount ?? 0,
  }));

  const submitEarning = (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(earningAmount);
    const weekNumber = Number(week);
    if (amount <= 0) return;
    setData((current) => ({
      ...current,
      earnings: [
        ...current.earnings.filter((item) => !(item.month === month && item.week === weekNumber)),
        { id: makeId(), month, week: weekNumber, amount },
      ],
    }));
    setEarningAmount("");
    toast.success(`Ganho da Semana ${weekNumber} salvo`);
  };

  const submitBill = (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(billAmount);
    if (!billName.trim() || amount <= 0) return;
    setData((current) => ({
      ...current,
      bills: [...current.bills, { id: makeId(), month, name: billName.trim(), amount, paid: false }],
    }));
    setBillName("");
    setBillAmount("");
    toast.success("Conta adicionada à reserva");
  };

  const submitWish = (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(wishAmount);
    if (!wishName.trim() || amount <= 0) return;
    setData((current) => ({
      ...current,
      wishes: [...current.wishes, { id: makeId(), name: wishName.trim(), amount }],
    }));
    setWishName("");
    setWishAmount("");
    toast.success("Desejo adicionado");
  };

  const deleteEarning = (id: string) => setData((current) => ({
    ...current,
    earnings: current.earnings.filter((item) => item.id !== id),
  }));
  const deleteBill = (id: string) => setData((current) => ({
    ...current,
    bills: current.bills.filter((item) => item.id !== id),
  }));
  const toggleBill = (id: string) => setData((current) => ({
    ...current,
    bills: current.bills.map((item) => item.id === id ? { ...item, paid: !item.paid } : item),
  }));
  const deleteWish = (id: string) => setData((current) => ({
    ...current,
    wishes: current.wishes.filter((item) => item.id !== id),
  }));

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
              <Landmark className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">FinControl</h1>
              <p className="text-xs text-muted-foreground">Seu corre, suas escolhas</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMonth(moveMonth(month, -1))} aria-label="Mês anterior">
              <ChevronLeft />
            </Button>
            <span className="w-28 text-center text-xs font-semibold capitalize">{monthLabel(month)}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMonth(moveMonth(month, 1))} aria-label="Próximo mês">
              <ChevronRight />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        <AnimatePresence mode="wait">
          {tab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <section className="overflow-hidden rounded-lg border border-primary/30 bg-card p-5 glow-border">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dinheiro Livre</p>
                    <p className="mt-1 font-mono text-3xl font-bold text-primary sm:text-4xl">{currency(totals.free)}</p>
                    <p className="mt-2 text-xs text-muted-foreground">Depois de reservar todas as contas do mês</p>
                  </div>
                  <div className="rounded-lg bg-primary/15 p-3 text-primary"><WalletCards className="h-6 w-6" /></div>
                </div>
                {totals.rawFree < 0 && (
                  <div className="rounded-md border border-expense/30 bg-expense/10 px-3 py-2 text-sm text-expense">
                    Faltam {currency(Math.abs(totals.rawFree))} para cobrir as contas.
                  </div>
                )}
              </section>

              <div className="grid grid-cols-3 gap-2">
                <SummaryCard label="Ganhos" value={totals.earnings} icon={CircleDollarSign} tone="income" />
                <SummaryCard label="Reservado" value={totals.reserved} icon={ShieldCheck} tone="warning" />
                <SummaryCard label="Pago" value={totals.paid} icon={Check} tone="primary" />
              </div>

              <section className="glass-card p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Fuel className="h-5 w-5 text-primary" />
                  <div><h2 className="font-semibold">Ganhos da semana</h2><p className="text-xs text-muted-foreground">Registre apenas o total do seu corre</p></div>
                </div>
                <form onSubmit={submitEarning} className="grid grid-cols-[110px_1fr] gap-2">
                  <select value={week} onChange={(event) => setWeek(event.target.value)} className="h-12 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Semana">
                    {[1, 2, 3, 4, 5].map((number) => <option key={number} value={number}>Semana {number}</option>)}
                  </select>
                  <Input type="number" min="0.01" step="0.01" inputMode="decimal" value={earningAmount} onChange={(event) => setEarningAmount(event.target.value)} placeholder="Total em R$" className="h-12" aria-label="Total ganho" />
                  <Button type="submit" className="col-span-2 h-12"><Plus /> Salvar ganho semanal</Button>
                </form>

                <div className="mt-4 space-y-2">
                  {monthEarnings.map((item) => (
                    <div key={item.id} className="flex min-h-12 items-center justify-between rounded-md bg-secondary/60 px-3">
                      <div><p className="text-sm font-medium">Semana {item.week}</p><p className="font-mono text-xs text-income">{currency(item.amount)}</p></div>
                      <Button variant="ghost" size="icon" onClick={() => deleteEarning(item.id)} aria-label={`Excluir Semana ${item.week}`}><Trash2 className="text-muted-foreground" /></Button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-card p-4">
                <div className="mb-2 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /><h2 className="font-semibold">Ritmo do mês</h2></div>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={weeklyChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(value: number) => currency(value)} cursor={{ fill: "hsl(var(--secondary))" }} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6 }} />
                    <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </section>
            </motion.div>
          )}

          {tab === "bills" && (
            <motion.div key="bills" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <PageTitle icon={ReceiptText} title="Contas do mês" subtitle="Todo este valor fica reservado antes do lazer" />
              <div className="grid grid-cols-3 gap-2">
                <SummaryCard label="Total" value={totals.reserved} icon={ShieldCheck} tone="warning" />
                <SummaryCard label="Pendente" value={totals.pending} icon={CalendarDays} tone="expense" />
                <SummaryCard label="Pago" value={totals.paid} icon={Check} tone="income" />
              </div>
              <section className="glass-card p-4">
                <h2 className="mb-3 font-semibold">Adicionar conta</h2>
                <div className="mb-3 flex flex-wrap gap-2">
                  {billSuggestions.map((name) => <Button key={name} variant="secondary" size="sm" onClick={() => setBillName(name)}>{name}</Button>)}
                </div>
                <form onSubmit={submitBill} className="space-y-2">
                  <Input value={billName} onChange={(event) => setBillName(event.target.value)} placeholder="Nome da conta" className="h-12" maxLength={60} />
                  <Input type="number" min="0.01" step="0.01" inputMode="decimal" value={billAmount} onChange={(event) => setBillAmount(event.target.value)} placeholder="Valor em R$" className="h-12" />
                  <Button type="submit" className="h-12 w-full"><Plus /> Reservar esta conta</Button>
                </form>
              </section>
              <section className="space-y-2">
                {monthBills.map((bill) => (
                  <div key={bill.id} className={`glass-card flex min-h-20 items-center gap-3 p-3 ${bill.paid ? "border-income/30" : ""}`}>
                    <Button variant={bill.paid ? "default" : "outline"} size="icon" className="h-11 w-11 shrink-0" onClick={() => toggleBill(bill.id)} aria-label={bill.paid ? "Marcar como pendente" : "Marcar como paga"}>
                      {bill.paid ? <Check /> : <ReceiptText />}
                    </Button>
                    <div className="min-w-0 flex-1"><p className={`truncate font-medium ${bill.paid ? "line-through text-muted-foreground" : ""}`}>{bill.name}</p><p className="font-mono text-sm text-warning">{currency(bill.amount)}</p></div>
                    <span className={`text-xs font-semibold ${bill.paid ? "text-income" : "text-warning"}`}>{bill.paid ? "Paga" : "Pendente"}</span>
                    <Button variant="ghost" size="icon" onClick={() => deleteBill(bill.id)} aria-label={`Excluir ${bill.name}`}><Trash2 className="text-muted-foreground" /></Button>
                  </div>
                ))}
                {!monthBills.length && <EmptyState text="Nenhuma conta reservada neste mês." />}
              </section>
            </motion.div>
          )}

          {tab === "wishes" && (
            <motion.div key="wishes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <PageTitle icon={Gift} title="Lista de desejos" subtitle={`Você tem ${currency(totals.free)} livres para escolher sem tocar nas contas`} />
              <section className="glass-card p-4">
                <h2 className="mb-3 font-semibold">Adicionar desejo</h2>
                <form onSubmit={submitWish} className="space-y-2">
                  <Input value={wishName} onChange={(event) => setWishName(event.target.value)} placeholder="O que você quer comprar?" className="h-12" maxLength={60} />
                  <Input type="number" min="0.01" step="0.01" inputMode="decimal" value={wishAmount} onChange={(event) => setWishAmount(event.target.value)} placeholder="Valor em R$" className="h-12" />
                  <Button type="submit" className="h-12 w-full"><Plus /> Adicionar à lista</Button>
                </form>
              </section>
              <section className="space-y-3">
                {data.wishes.map((wish) => {
                  const canBuy = totals.free >= wish.amount;
                  const percent = Math.min(100, Math.round((totals.free / wish.amount) * 100));
                  const missing = Math.max(0, wish.amount - totals.free);
                  return (
                    <div key={wish.id} className={`glass-card p-4 ${canBuy ? "border-income/40" : ""}`}>
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0"><h3 className="truncate font-semibold">{wish.name}</h3><p className="font-mono text-sm text-muted-foreground">{currency(wish.amount)}</p></div>
                        <div className="flex items-center gap-1">
                          <span className={`rounded-md px-2 py-1 text-xs font-semibold ${canBuy ? "bg-income/15 text-income" : "bg-warning/15 text-warning"}`}>{canBuy ? "Pode comprar agora" : "Guardar mais"}</span>
                          <Button variant="ghost" size="icon" onClick={() => deleteWish(wish.id)} aria-label={`Excluir ${wish.name}`}><Trash2 className="text-muted-foreground" /></Button>
                        </div>
                      </div>
                      <Progress value={percent} className="h-2.5" />
                      <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{percent}% disponível</span><span>{canBuy ? "Cabe no dinheiro livre" : `Faltam ${currency(missing)}`}</span></div>
                    </div>
                  );
                })}
                {!data.wishes.length && <EmptyState text="Sua lista ainda está vazia." />}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-3 pt-2 backdrop-blur-xl">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
          <NavItem active={tab === "home"} icon={Home} label="Início" onClick={() => setTab("home")} />
          <NavItem active={tab === "bills"} icon={ReceiptText} label="Contas" onClick={() => setTab("bills")} />
          <NavItem active={tab === "wishes"} icon={Gift} label="Desejos" onClick={() => setTab("wishes")} />
        </div>
      </nav>
    </div>
  );
};

function SummaryCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof CircleDollarSign; tone: "income" | "warning" | "expense" | "primary" }) {
  const tones = { income: "text-income bg-income/10", warning: "text-warning bg-warning/10", expense: "text-expense bg-expense/10", primary: "text-primary bg-primary/10" };
  return <div className="glass-card min-w-0 p-3"><div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-md ${tones[tone]}`}><Icon className="h-4 w-4" /></div><p className="truncate text-xs text-muted-foreground">{label}</p><p className="mt-1 break-words font-mono text-sm font-bold sm:text-base">{currency(value)}</p></div>;
}

function PageTitle({ icon: Icon, title, subtitle }: { icon: typeof Gift; title: string; subtitle: string }) {
  return <div className="flex items-start gap-3 py-1"><div className="rounded-lg bg-primary/15 p-2.5 text-primary"><Icon className="h-5 w-5" /></div><div><h2 className="text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p></div></div>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">{text}</div>;
}

function NavItem({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof Home; label: string; onClick: () => void }) {
  return <Button variant="ghost" onClick={onClick} className={`h-14 flex-col gap-1 rounded-md ${active ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}><Icon className="h-5 w-5" /><span className="text-xs">{label}</span></Button>;
}

export default Index;