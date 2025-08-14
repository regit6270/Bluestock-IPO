import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MainIPOBoardProps {
  stats?: {
    total: number;
    upcoming: number;
    ongoing: number;
    newListed: number;
    closed: number;
  };
}

export default function MainIPOBoard({ stats }: MainIPOBoardProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current || !stats) return;

    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 30;
    const innerRadius = radius * 0.6;

    const data = [
      { label: 'Upcoming', value: stats.upcoming, color: '#6366F1' },
      { label: 'Ongoing', value: stats.ongoing, color: '#10B981' },
      { label: 'New Listed', value: stats.newListed, color: '#FF5722' }
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw doughnut chart
    data.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      currentAngle += sliceAngle;
    });

    // Draw center text
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 24px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText(stats.total.toString(), centerX, centerY - 10);
    ctx.font = '14px Poppins';
    ctx.fillText('Total IPOs', centerX, centerY + 10);

  }, [stats]);

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Main IPO Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading IPO statistics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Main IPO Board</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 flex items-center justify-center mb-6 lg:mb-0">
            <canvas
              ref={chartRef}
              width={300}
              height={300}
              className="max-w-full"
              data-testid="chart-main-ipo-board"
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-bluestock-primary rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Upcoming</span>
              </div>
              <span className="font-semibold text-gray-800" data-testid="stat-upcoming">
                {stats.upcoming}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Ongoing</span>
              </div>
              <span className="font-semibold text-gray-800" data-testid="stat-ongoing">
                {stats.ongoing}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-bluestock-accent rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">New Listed</span>
              </div>
              <span className="font-semibold text-gray-800" data-testid="stat-new-listed">
                {stats.newListed}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
