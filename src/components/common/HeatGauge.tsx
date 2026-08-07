'use client';

import styled from 'styled-components';

const Wrap = styled.div<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  position: relative;
  flex-shrink: 0;
`;

const Svg = styled.svg`
  transform: rotate(-90deg);
`;

const Label = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  line-height: 1.05;
`;

const Score = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
`;

const Caption = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #94a3b8;
`;

type HeatGaugeProps = {
  score: number;
  size?: number;
};

export function HeatGauge({ score, size = 64 }: HeatGaugeProps) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(score, 100) / 100) * c;

  return (
    <Wrap $size={size} aria-label={`Heat score ${score}`}>
      <Svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#2563eb"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      <Label>
        <div>
          <Score>{score}</Score>
          <Caption>HEAT</Caption>
        </div>
      </Label>
    </Wrap>
  );
}
