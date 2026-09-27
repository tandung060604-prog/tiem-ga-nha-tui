import { TypeSafeClient, choice, score } from '@typesafe-ai/sdk';

const client = new TypeSafeClient({ timeout: 10000 });

async function run() {
  const res = await client.systemOne({
    state: {
      game: 'Tiệm Gà Nhà Tui',
      completedPhase1: 'kitchen_juice (bếp chiên, khói bốc, bọt sôi, nảy 3D, thanh đo nhiệt)',
      nextPhasesCandidate: ['customer_thoughts', 'summary_radar', 'header_hud', 'order_popover']
    },
    questions: {
      phase2Focus: choice('Sau khi hoàn thiện Kitchen Juice, bước tiếp theo nên tập trung vào đâu để tối ưu vòng lặp game?', {
        customer_thoughts: 'Hàng thực khách: Bong bóng suy nghĩ realtime (Customer Thoughts), biểu cảm thay đổi theo thời gian kiên nhẫn và hoạt họa nhận món thả tim',
        summary_radar: 'Màn tổng kết ngày: Biểu đồ Radar SVG 5 tiêu chí (Hương vị, Tốc độ, Vệ sinh, Không gian, Giá) + Đánh giá sao rõ ràng trực quan',
        header_hud: 'Thanh Header: Biển hiệu gỗ đèn lồng, hiệu ứng tiền nhảy số mượt (odometer) và đồng hồ tròn'
      }),
      radarChartImpact: score('Biểu đồ Radar SVG 5 góc tác động thế nào đến động lực cải thiện quán của người chơi?', [
        'Không để ý',
        'Có cũng được',
        'Khá hữu ích để biết điểm yếu',
        'Rất trực quan và tạo động lực nâng cấp',
        'Cực kỳ cuốn hút, người chơi muốn kéo max 5 góc'
      ])
    }
  });

  console.log(JSON.stringify(res.answers, null, 2));
}

run().catch(console.error);
