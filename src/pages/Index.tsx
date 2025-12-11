import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type HistoryItem = {
  expression: string;
  result: string;
};

const Index = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isNewCalculation, setIsNewCalculation] = useState(true);

  const constants = {
    π: Math.PI,
    e: Math.E,
    φ: (1 + Math.sqrt(5)) / 2,
  };

  const handleNumber = (num: string) => {
    if (isNewCalculation) {
      setDisplay(num);
      setIsNewCalculation(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    setDisplay(display + ' ' + op + ' ');
    setIsNewCalculation(false);
  };

  const handleFunction = (func: string) => {
    try {
      const value = parseFloat(display);
      let result: number;

      switch (func) {
        case 'sin':
          result = Math.sin(value);
          break;
        case 'cos':
          result = Math.cos(value);
          break;
        case 'tan':
          result = Math.tan(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        case '1/x':
          result = 1 / value;
          break;
        case 'x²':
          result = value * value;
          break;
        default:
          return;
      }

      const expression = `${func}(${value})`;
      const resultStr = result.toString();
      setDisplay(resultStr);
      setHistory([{ expression, result: resultStr }, ...history]);
      setIsNewCalculation(true);
    } catch (error) {
      setDisplay('Error');
      setIsNewCalculation(true);
    }
  };

  const handleConstant = (constant: keyof typeof constants) => {
    setDisplay(constants[constant].toString());
    setIsNewCalculation(true);
  };

  const calculate = () => {
    try {
      const result = eval(display.replace('×', '*').replace('÷', '/'));
      const resultStr = result.toString();
      setHistory([{ expression: display, result: resultStr }, ...history]);
      setDisplay(resultStr);
      setIsNewCalculation(true);
    } catch (error) {
      setDisplay('Error');
      setIsNewCalculation(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setIsNewCalculation(true);
  };

  const memoryAdd = () => {
    const current = parseFloat(display);
    setMemory((memory || 0) + current);
  };

  const memorySubtract = () => {
    const current = parseFloat(display);
    setMemory((memory || 0) - current);
  };

  const memoryRecall = () => {
    if (memory !== null) {
      setDisplay(memory.toString());
      setIsNewCalculation(true);
    }
  };

  const memoryClear = () => {
    setMemory(null);
  };

  const calcButtonClass =
    'h-14 text-lg font-semibold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] active:scale-95';
  const operatorButtonClass = `${calcButtonClass} bg-primary text-primary-foreground`;
  const functionButtonClass = `${calcButtonClass} bg-secondary text-secondary-foreground`;
  const numberButtonClass = `${calcButtonClass} bg-card text-card-foreground border-2 border-border`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#1a1530] to-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            科学計算機
          </h1>
          <p className="text-muted-foreground text-sm">SCIENTIFIC CALCULATOR v2.0</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 backdrop-blur-sm bg-card/90 border-2 border-primary/30 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              <div className="mb-4 p-4 bg-muted/50 rounded-lg border-2 border-accent/30 min-h-[80px] flex items-center justify-end shadow-[inset_0_2px_20px_rgba(14,165,233,0.3)]">
                <div className="text-right w-full">
                  {memory !== null && (
                    <div className="text-xs text-accent mb-1 flex items-center justify-end gap-1">
                      <Icon name="Save" size={12} />
                      M: {memory}
                    </div>
                  )}
                  <p
                    className="text-4xl font-bold text-foreground break-all"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    {display}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="basic">Основные</TabsTrigger>
                  <TabsTrigger value="scientific">Научные</TabsTrigger>
                  <TabsTrigger value="constants">Константы</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    <Button onClick={clear} className={`${operatorButtonClass} bg-destructive text-destructive-foreground`}>
                      C
                    </Button>
                    <Button onClick={() => handleOperator('^')} className={operatorButtonClass}>
                      x^y
                    </Button>
                    <Button onClick={() => handleFunction('sqrt')} className={functionButtonClass}>
                      √
                    </Button>
                    <Button onClick={() => handleOperator('÷')} className={operatorButtonClass}>
                      ÷
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {['7', '8', '9'].map((num) => (
                      <Button key={num} onClick={() => handleNumber(num)} className={numberButtonClass}>
                        {num}
                      </Button>
                    ))}
                    <Button onClick={() => handleOperator('×')} className={operatorButtonClass}>
                      ×
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {['4', '5', '6'].map((num) => (
                      <Button key={num} onClick={() => handleNumber(num)} className={numberButtonClass}>
                        {num}
                      </Button>
                    ))}
                    <Button onClick={() => handleOperator('-')} className={operatorButtonClass}>
                      −
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {['1', '2', '3'].map((num) => (
                      <Button key={num} onClick={() => handleNumber(num)} className={numberButtonClass}>
                        {num}
                      </Button>
                    ))}
                    <Button onClick={() => handleOperator('+')} className={operatorButtonClass}>
                      +
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <Button onClick={() => handleNumber('0')} className={`${numberButtonClass} col-span-2`}>
                      0
                    </Button>
                    <Button onClick={() => handleNumber('.')} className={numberButtonClass}>
                      .
                    </Button>
                    <Button onClick={calculate} className={`${operatorButtonClass} bg-accent text-accent-foreground`}>
                      =
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="scientific" className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    <Button onClick={() => handleFunction('sin')} className={functionButtonClass}>
                      sin
                    </Button>
                    <Button onClick={() => handleFunction('cos')} className={functionButtonClass}>
                      cos
                    </Button>
                    <Button onClick={() => handleFunction('tan')} className={functionButtonClass}>
                      tan
                    </Button>
                    <Button onClick={() => handleFunction('x²')} className={functionButtonClass}>
                      x²
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <Button onClick={() => handleFunction('ln')} className={functionButtonClass}>
                      ln
                    </Button>
                    <Button onClick={() => handleFunction('log')} className={functionButtonClass}>
                      log
                    </Button>
                    <Button onClick={() => handleFunction('sqrt')} className={functionButtonClass}>
                      √x
                    </Button>
                    <Button onClick={() => handleFunction('1/x')} className={functionButtonClass}>
                      1/x
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <Button onClick={() => handleOperator('^')} className={functionButtonClass}>
                      x^y
                    </Button>
                    <Button onClick={() => handleNumber('(')} className={numberButtonClass}>
                      (
                    </Button>
                    <Button onClick={() => handleNumber(')')} className={numberButtonClass}>
                      )
                    </Button>
                    <Button onClick={calculate} className={`${operatorButtonClass} bg-accent text-accent-foreground`}>
                      =
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="constants" className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Button onClick={() => handleConstant('π')} className={functionButtonClass}>
                      <span className="flex flex-col items-center">
                        <span className="text-2xl">π</span>
                        <span className="text-xs opacity-70">Pi</span>
                      </span>
                    </Button>
                    <Button onClick={() => handleConstant('e')} className={functionButtonClass}>
                      <span className="flex flex-col items-center">
                        <span className="text-2xl">e</span>
                        <span className="text-xs opacity-70">Euler</span>
                      </span>
                    </Button>
                    <Button onClick={() => handleConstant('φ')} className={functionButtonClass}>
                      <span className="flex flex-col items-center">
                        <span className="text-2xl">φ</span>
                        <span className="text-xs opacity-70">Golden</span>
                      </span>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Icon name="Save" size={14} />
                  Память:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <Button onClick={memoryAdd} variant="outline" className="hover:bg-accent/20">
                    M+
                  </Button>
                  <Button onClick={memorySubtract} variant="outline" className="hover:bg-accent/20">
                    M−
                  </Button>
                  <Button onClick={memoryRecall} variant="outline" className="hover:bg-accent/20">
                    MR
                  </Button>
                  <Button onClick={memoryClear} variant="outline" className="hover:bg-destructive/20">
                    MC
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 backdrop-blur-sm bg-card/90 border-2 border-secondary/30 shadow-[0_0_30px_rgba(217,70,239,0.2)] h-full">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="History" size={20} className="text-secondary" />
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  История
                </h2>
              </div>
              <ScrollArea className="h-[500px] pr-4">
                {history.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Icon name="Calculator" size={48} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Пока нет вычислений</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-muted/30 rounded-lg border border-border hover:border-secondary/50 transition-all cursor-pointer hover:scale-105"
                        onClick={() => {
                          setDisplay(item.result);
                          setIsNewCalculation(true);
                        }}
                      >
                        <p className="text-sm text-muted-foreground truncate">{item.expression}</p>
                        <p className="text-lg font-bold text-foreground truncate" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                          = {item.result}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
