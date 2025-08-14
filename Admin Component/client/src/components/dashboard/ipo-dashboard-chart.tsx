import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function IPODashboardChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple pie chart implementation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    const data = [
      { label: 'IPO in Loss', value: 9, color: '#8B5CF6' },
      { label: 'Total IPO', value: 30, color: '#FF8A50' },
      { label: 'IPO in Gain', value: 20, color: '#06D6A0' }
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pie slices with overlapping design
    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      
      // Adjust radius for overlapping effect
      const itemRadius = index === 1 ? radius : radius * 0.8; // Make center piece largest
      const offsetX = index === 0 ? -20 : index === 2 ? 20 : 0;
      const offsetY = index === 0 ? -20 : index === 2 ? 20 : 0;
      
      ctx.beginPath();
      ctx.moveTo(centerX + offsetX, centerY + offsetY);
      ctx.arc(centerX + offsetX, centerY + offsetY, itemRadius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw value in center of each circle
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px Poppins';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), centerX + offsetX, centerY + offsetY + 5);

      // Draw labels below
      ctx.fillStyle = '#374151';
      ctx.font = '11px Poppins';
      ctx.fillText(item.label, centerX + offsetX, centerY + offsetY + itemRadius + 20);

      currentAngle += sliceAngle;
    });

  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>IPO Dashboard India</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <canvas
            ref={chartRef}
            width={400}
            height={250}
            className="max-w-full"
            data-testid="chart-ipo-dashboard"
          />
        </div>
      </CardContent>
    </Card>
  );
}
