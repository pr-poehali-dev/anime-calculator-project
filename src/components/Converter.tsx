import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type ConversionCategory = 'length' | 'weight' | 'temperature';

type ConversionUnit = {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
};

const conversions: Record<ConversionCategory, Record<string, ConversionUnit>> = {
  length: {
    meter: {
      name: 'Метры',
      symbol: 'м',
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    kilometer: {
      name: 'Километры',
      symbol: 'км',
      toBase: (v) => v * 1000,
      fromBase: (v) => v / 1000,
    },
    centimeter: {
      name: 'Сантиметры',
      symbol: 'см',
      toBase: (v) => v / 100,
      fromBase: (v) => v * 100,
    },
    millimeter: {
      name: 'Миллиметры',
      symbol: 'мм',
      toBase: (v) => v / 1000,
      fromBase: (v) => v * 1000,
    },
    mile: {
      name: 'Мили',
      symbol: 'mi',
      toBase: (v) => v * 1609.344,
      fromBase: (v) => v / 1609.344,
    },
    yard: {
      name: 'Ярды',
      symbol: 'yd',
      toBase: (v) => v * 0.9144,
      fromBase: (v) => v / 0.9144,
    },
    foot: {
      name: 'Футы',
      symbol: 'ft',
      toBase: (v) => v * 0.3048,
      fromBase: (v) => v / 0.3048,
    },
    inch: {
      name: 'Дюймы',
      symbol: 'in',
      toBase: (v) => v * 0.0254,
      fromBase: (v) => v / 0.0254,
    },
  },
  weight: {
    kilogram: {
      name: 'Килограммы',
      symbol: 'кг',
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    gram: {
      name: 'Граммы',
      symbol: 'г',
      toBase: (v) => v / 1000,
      fromBase: (v) => v * 1000,
    },
    milligram: {
      name: 'Миллиграммы',
      symbol: 'мг',
      toBase: (v) => v / 1000000,
      fromBase: (v) => v * 1000000,
    },
    ton: {
      name: 'Тонны',
      symbol: 'т',
      toBase: (v) => v * 1000,
      fromBase: (v) => v / 1000,
    },
    pound: {
      name: 'Фунты',
      symbol: 'lb',
      toBase: (v) => v * 0.453592,
      fromBase: (v) => v / 0.453592,
    },
    ounce: {
      name: 'Унции',
      symbol: 'oz',
      toBase: (v) => v * 0.0283495,
      fromBase: (v) => v / 0.0283495,
    },
  },
  temperature: {
    celsius: {
      name: 'Цельсий',
      symbol: '°C',
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    fahrenheit: {
      name: 'Фаренгейт',
      symbol: '°F',
      toBase: (v) => (v - 32) * (5 / 9),
      fromBase: (v) => v * (9 / 5) + 32,
    },
    kelvin: {
      name: 'Кельвин',
      symbol: 'K',
      toBase: (v) => v - 273.15,
      fromBase: (v) => v + 273.15,
    },
  },
};

const Converter = () => {
  const [category, setCategory] = useState<ConversionCategory>('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [inputValue, setInputValue] = useState('1');
  const [result, setResult] = useState('');

  const handleConvert = () => {
    try {
      const value = parseFloat(inputValue);
      if (isNaN(value)) {
        setResult('Ошибка');
        return;
      }

      const fromConversion = conversions[category][fromUnit];
      const toConversion = conversions[category][toUnit];

      const baseValue = fromConversion.toBase(value);
      const convertedValue = toConversion.fromBase(baseValue);

      setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ''));
    } catch (error) {
      setResult('Ошибка');
    }
  };

  const handleCategoryChange = (newCategory: ConversionCategory) => {
    setCategory(newCategory);
    const units = Object.keys(conversions[newCategory]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setResult('');
  };

  const currentUnits = conversions[category];

  return (
    <Card className="p-6 backdrop-blur-sm bg-card/90 border-2 border-accent/30 shadow-[0_0_30px_rgba(14,165,233,0.2)]">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="ArrowLeftRight" size={20} className="text-accent" />
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Конвертер
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Категория</label>
          <Select value={category} onValueChange={(v) => handleCategoryChange(v as ConversionCategory)}>
            <SelectTrigger className="bg-muted/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="length">
                <span className="flex items-center gap-2">
                  <Icon name="Ruler" size={16} />
                  Длина
                </span>
              </SelectItem>
              <SelectItem value="weight">
                <span className="flex items-center gap-2">
                  <Icon name="Weight" size={16} />
                  Вес
                </span>
              </SelectItem>
              <SelectItem value="temperature">
                <span className="flex items-center gap-2">
                  <Icon name="Thermometer" size={16} />
                  Температура
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Из</label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="bg-muted/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(currentUnits).map(([key, unit]) => (
                  <SelectItem key={key} value={key}>
                    {unit.name} ({unit.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">В</label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="bg-muted/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(currentUnits).map(([key, unit]) => (
                  <SelectItem key={key} value={key}>
                    {unit.name} ({unit.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Значение</label>
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-muted/50 border-border text-lg"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          />
        </div>

        <Button onClick={handleConvert} className="w-full bg-accent text-accent-foreground hover:scale-105 transition-all">
          <Icon name="ArrowLeftRight" size={18} className="mr-2" />
          Конвертировать
        </Button>

        {result && (
          <div className="p-4 bg-primary/20 rounded-lg border-2 border-primary/50 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-1">Результат:</p>
            <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              {result} {currentUnits[toUnit].symbol}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Converter;
