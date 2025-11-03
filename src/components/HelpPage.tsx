import React, { useState } from "react";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Video, 
  Mail, 
  Phone, 
  MessageSquare,
  Send
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface FAQItem {
  question: string;
  answer: string;
}

export function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const faqItems: FAQItem[] = [
    {
      question: "Как создать новую установку?",
      answer: "Перейдите на страницу 'Установки' и нажмите кнопку '+' или 'Создать установку'. Заполните форму с номером стойки, выберите ноутбук и принтер.",
    },
    {
      question: "Как списать расходные материалы?",
      answer: "На странице 'Расходники' выберите нужный материал и нажмите кнопку '-5' для списания. Можно также открыть детали и указать точное количество.",
    },
    {
      question: "Как найти нужное оборудование?",
      answer: "Используйте страницу 'Поиск' или перейдите в раздел 'Оборудование' и используйте фильтры по типу оборудования.",
    },
    {
      question: "Что делать при низком остатке расходников?",
      answer: "Система автоматически отправит уведомление. Вы также можете увидеть предупреждение в разделе 'Расходники' с меткой 'Низкий остаток'.",
    },
    {
      question: "Как посмотреть историю использования оборудования?",
      answer: "Откройте детали оборудования на странице 'Оборудование' и просмотрите раздел 'История перемещений'.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Форма отправлена:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Помощь</h2>
        <p className="text-sm text-muted-foreground">Ответы на частые вопросы и поддержка</p>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="mb-3 text-sm font-medium">Частые вопросы</h3>
        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <Card key={index} className="border-border/40 bg-card/50">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-md bg-primary/10 p-1.5">
                        <HelpCircle className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-left text-sm">{item.question}</CardTitle>
                    </div>
                    {expandedFAQ === index ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
              </button>
              {expandedFAQ === index && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Видео */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Видеоинструкции</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <button className="flex w-full items-center gap-3 rounded-md border border-border/40 bg-background/50 p-3 transition-all hover:border-primary/50 hover:bg-card/80">
            <div className="rounded-md bg-primary/10 p-2">
              <Video className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Начало работы</p>
              <p className="text-xs text-muted-foreground">5:30 мин</p>
            </div>
          </button>
          <button className="flex w-full items-center gap-3 rounded-md border border-border/40 bg-background/50 p-3 transition-all hover:border-primary/50 hover:bg-card/80">
            <div className="rounded-md bg-primary/10 p-2">
              <Video className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Управление оборудованием</p>
              <p className="text-xs text-muted-foreground">8:15 мин</p>
            </div>
          </button>
        </CardContent>
      </Card>

      {/* Контакты */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Контакты поддержки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-2">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-xs text-muted-foreground">vp.panteleev@expoforum.ru</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-2">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Telegram</p>
              <p className="text-xs text-muted-foreground">@tribul8ion</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Форма обратной связи */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Обратная связь</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Сообщение</Label>
              <Textarea
                id="message"
                placeholder="Опишите ваш вопрос или предложение..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full shadow-sm">
              <Send className="mr-2 h-4 w-4" />
              Отправить
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
