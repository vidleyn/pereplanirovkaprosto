import React, { useState, useEffect } from 'react';

interface SidebarProps {
  blueprint3d: any;
  isOpen: boolean;
  onToggle: () => void;
}

interface UnitConfig {
  a: boolean; // feet and inches
  b: boolean; // inches
  c: boolean; // centimeters
  d: boolean; // millimeters
  e: boolean; // meters
}

export default function Sidebar({ blueprint3d, isOpen, onToggle }: SidebarProps) {
  const [units, setUnits] = useState<UnitConfig>({
    a: false,
    b: false,
    c: false,
    d: false,
    e: true, // default to meters
  });

  const [snapToGrid, setSnapToGrid] = useState(true);
  const [snapValue, setSnapValue] = useState(0.1);
  const [gridResolution, setGridResolution] = useState(0.1);
  const [scale, setScale] = useState(1.0);

  // Camera settings
  const [cameraRatio, setCameraRatio] = useState(1);
  const [cameraRatio2, setCameraRatio2] = useState(1);
  const [cameraLocked, setCameraLocked] = useState(false);

  // 2D Editor settings
  const [wallInfo, setWallInfo] = useState({
    exterior: false,
    interior: false,
    midline: false,
    labels: false,
    exteriorlabel: false,
    interiorlabel: false,
    midlinelabel: false,
  });

  const BP3DJS = (window as any).BP3DJS;

  useEffect(() => {
    if (!blueprint3d || !BP3DJS) return;

    // Initialize from current configuration
    const currentUnit = BP3DJS.Configuration.getStringValue(BP3DJS.configDimUnit);
    const unitMap: Record<string, keyof UnitConfig> = {
      [BP3DJS.dimFeetAndInch]: 'a',
      [BP3DJS.dimInch]: 'b',
      [BP3DJS.dimCentiMeter]: 'c',
      [BP3DJS.dimMilliMeter]: 'd',
      [BP3DJS.dimMeter]: 'e',
    };

    if (unitMap[currentUnit]) {
      const newUnits: UnitConfig = { a: false, b: false, c: false, d: false, e: false };
      newUnits[unitMap[currentUnit]] = true;
      setUnits(newUnits);
    }

    // Load other settings
    setSnapToGrid(BP3DJS.config.snapToGrid || false);
    setSnapValue(
      BP3DJS.Dimensioning.cmToMeasureRaw(
        BP3DJS.Configuration.getNumericValue(BP3DJS.snapTolerance)
      )
    );
    setGridResolution(
      BP3DJS.Dimensioning.cmToMeasureRaw(
        BP3DJS.Configuration.getNumericValue(BP3DJS.gridSpacing)
      )
    );
    setScale(BP3DJS.config.scale || 1.0);
  }, [blueprint3d]);

  const handleUnitChange = (unit: keyof UnitConfig) => {
    if (!BP3DJS || !blueprint3d) return;

    const newUnits: UnitConfig = { a: false, b: false, c: false, d: false, e: false };
    newUnits[unit] = true;
    setUnits(newUnits);

    const unitLabels = {
      a: BP3DJS.dimFeetAndInch,
      b: BP3DJS.dimInch,
      c: BP3DJS.dimCentiMeter,
      d: BP3DJS.dimMilliMeter,
      e: BP3DJS.dimMeter,
    };

    BP3DJS.Configuration.setValue(BP3DJS.configDimUnit, unitLabels[unit]);
    blueprint3d.floorplanner?.view?.draw();
  };

  const handleSnapToGridChange = (value: boolean) => {
    if (!BP3DJS) return;
    setSnapToGrid(value);
    BP3DJS.config.snapToGrid = value;
  };

  const handleSnapValueChange = (value: number) => {
    if (!BP3DJS || !blueprint3d) return;
    setSnapValue(value);
    BP3DJS.Configuration.setValue(
      BP3DJS.snapTolerance,
      BP3DJS.Dimensioning.cmFromMeasureRaw(value)
    );
  };

  const handleGridResolutionChange = (value: number) => {
    if (!BP3DJS || !blueprint3d) return;
    setGridResolution(value);
    BP3DJS.Configuration.setValue(
      BP3DJS.gridSpacing,
      BP3DJS.Dimensioning.cmFromMeasureRaw(value)
    );
    blueprint3d.floorplanner?.view?.draw();
  };

  const handleScaleChange = (value: number) => {
    if (!BP3DJS || !blueprint3d) return;
    setScale(value);
    BP3DJS.config.scale = value;
    blueprint3d.floorplanner?.zoom();
    blueprint3d.floorplanner?.view?.draw();
  };

  const handleCameraRatioChange = (value: number) => {
    if (!blueprint3d) return;
    setCameraRatio(value);
    blueprint3d.three?.changeClippingPlanes(value, cameraRatio2);
  };

  const handleCameraRatio2Change = (value: number) => {
    if (!blueprint3d) return;
    setCameraRatio2(value);
    blueprint3d.three?.changeClippingPlanes(cameraRatio, value);
  };

  const handleCameraLockChange = (value: boolean) => {
    if (!blueprint3d) return;
    setCameraLocked(value);
    blueprint3d.three?.lockView(value);
  };

  const handleCameraReset = () => {
    if (!blueprint3d) return;
    blueprint3d.three?.resetClipping();
    setCameraRatio(1);
    setCameraRatio2(1);
  };

  const currentUnit = BP3DJS?.Configuration?.getStringValue(BP3DJS?.configDimUnit) || 'm';

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[1000] px-2 py-2.5 bg-gray-800 text-white border-none cursor-pointer rounded-l-md hover:bg-gray-700 transition-colors"
        title="Открыть настройки"
      >
        <span className="glyphicon glyphicon-cog" />
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-0 w-80 h-screen bg-[#2d2d2d] text-white overflow-y-auto z-[1000] shadow-[-2px_0_10px_rgba(0,0,0,0.3)] text-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 className="m-0 text-lg font-semibold">Интерфейс и настройки</h2>
        <button
          onClick={onToggle}
          className="bg-transparent border-none text-white cursor-pointer text-xl px-1 hover:text-gray-300 transition-colors"
        >
          ×
        </button>
      </div>

      <div className="p-4">
        {/* Units Section */}
        <Section title="Единицы измерения">
          <RadioGroup
            options={[
              { value: 'a', label: "Футы и дюймы" },
              { value: 'b', label: "Дюймы" },
              { value: 'c', label: 'Сантиметры' },
              { value: 'd', label: 'Миллиметры' },
              { value: 'e', label: 'Метры' },
            ]}
            selected={Object.keys(units).find((k) => units[k as keyof UnitConfig]) || 'e'}
            onChange={(value) => handleUnitChange(value as keyof UnitConfig)}
          />
        </Section>

        {/* 2D Editor Section */}
        <Section title="2D Редактор">
          <Checkbox
            label="Привязка к сетке"
            checked={snapToGrid}
            onChange={handleSnapToGridChange}
          />
          <NumberInput
            label={`Шаг привязки (${currentUnit})`}
            value={snapValue}
            onChange={handleSnapValueChange}
            min={0.1}
            step={0.1}
          />
          <NumberInput
            label={`Разрешение сетки (${currentUnit})`}
            value={gridResolution}
            onChange={handleGridResolutionChange}
            min={0.1}
            step={0.1}
          />
          <Slider
            label="Масштаб"
            value={scale}
            onChange={handleScaleChange}
            min={0.25}
            max={5}
            step={0.25}
          />

          <SubSection title="Измерения стен">
            <Checkbox
              label="Внешние"
              checked={wallInfo.exterior}
              onChange={(v) => setWallInfo({ ...wallInfo, exterior: v })}
            />
            <Checkbox
              label="Внутренние"
              checked={wallInfo.interior}
              onChange={(v) => setWallInfo({ ...wallInfo, interior: v })}
            />
            <Checkbox
              label="Средняя линия"
              checked={wallInfo.midline}
              onChange={(v) => setWallInfo({ ...wallInfo, midline: v })}
            />
            <Checkbox
              label="Подписи"
              checked={wallInfo.labels}
              onChange={(v) => setWallInfo({ ...wallInfo, labels: v })}
            />
          </SubSection>
        </Section>

        {/* 3D Editor Section */}
        <Section title="3D Редактор">
          <SubSection title="Ограничения камеры">
            <Slider
              label="Диапазон"
              value={cameraRatio}
              onChange={handleCameraRatioChange}
              min={-1}
              max={1}
              step={0.01}
            />
            <Slider
              label="Диапазон 2"
              value={cameraRatio2}
              onChange={handleCameraRatio2Change}
              min={-1}
              max={1}
              step={0.01}
            />
            <Checkbox
              label="Заблокировать вид"
              checked={cameraLocked}
              onChange={handleCameraLockChange}
            />
            <button
              onClick={handleCameraReset}
              className="w-full py-2 mt-2.5 bg-gray-600 text-white border-none rounded cursor-pointer hover:bg-gray-500 transition-colors"
            >
              Сбросить
            </button>
          </SubSection>
        </Section>
      </div>
    </div>
  );
}

// Helper Components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="m-0 mb-2.5 text-base text-blue-400 font-bold">
        {title}
      </h3>
      {children}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ml-4 mt-2.5 mb-2.5">
      <h4 className="m-0 mb-2 text-sm text-gray-400">{title}</h4>
      {children}
    </div>
  );
}

function RadioGroup({
  options,
  selected,
  onChange,
}: {
  options: Array<{ value: string; label: string }>;
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`block p-2 cursor-pointer rounded mb-1 transition-colors ${
            selected === opt.value
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'hover:bg-gray-700'
          }`}
        >
          <input
            type="radio"
            value={opt.value}
            checked={selected === opt.value}
            onChange={() => onChange(opt.value)}
            className="mr-2"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center p-2 cursor-pointer rounded mb-1 hover:bg-gray-700 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mr-2"
      />
      {label}
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  step,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <div className="mb-2.5">
      <label className="block mb-1.5 text-xs">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        step={step}
        className="w-full px-1.5 py-1.5 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div className="mb-4">
      <label className="block mb-1.5 text-xs">
        {label}: {value.toFixed(2)}
      </label>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}
