import { TypeSafeClient, choice, score } from '@typesafe-ai/sdk';

const client = new TypeSafeClient({ timeout: 10000 });

async function run() {
  const res = await client.systemOne({
    state: {
      game: 'Tiệm Gà Nhà Tui',
      loreContext: 'Hẻm 1102 Sài Gòn - 36 Nhân vật (33 cư dân/thực khách/tiểu thương + 3 động vật)',
      mainCampaign: '5 Hồi truyện tương ứng 5 Chương phát triển kinh doanh',
      karmaAxes: 'Community (Tình Nghĩa), Craftsmanship (Tay Nghề Bếp), Ambition (Mở Rộng)'
    },
    questions: {
      networkTopology: choice('Mô hình mạng lưới liên kết 36 nhân vật nào tạo chiều sâu cảm xúc và kịch tính nhất?', {
        micro_community_web: 'Mạng lưới xóm giềng đan xen hữu cơ (Gia đình, Bạn hàng cung ứng, Đối kháng cạnh tranh, Ân nghĩa cứu trợ)',
        hierarchical_factions: 'Phân tầng theo 3 thế lực cứng (Phe Bình Dân Hẻm vs Phe Doanh Nhân Chuỗi vs Phe Chính Quyền)',
        hub_and_spoke: 'Tất cả chỉ liên kết trực tiếp với Chủ Quán mà không có quan hệ chéo'
      }),
      storyIntegration: choice('Cách tốt nhất để 36 nhân vật tác động trực tiếp vào 5 Hồi truyện chính là gì?', {
        ensemble_arcs: 'Mỗi Hồi có 1 Cặp Nhân Vật Xung Đột đại diện cho thế tiến thoái lưỡng nan của Hẻm, kéo theo mạng lưới bạn hàng liên đới',
        random_cameo: 'Chỉ xuất hiện ngẫu nhiên qua các câu thoại ngắn không ảnh hưởng cốt truyện',
        linear_boss: 'Mỗi Hồi mở khóa lần lượt 7 nhân vật như các chướng ngại vật'
      }),
      webVisualizerLayout: choice('Sơ đồ tương tác HTML trực quan trên web nên trình bày theo cấu trúc nào?', {
        swimlane_chapters: 'Sơ đồ phân luồng theo 5 Hồi truyện + Cột mạng lưới gia đình & đối tác + Bảng tra cứu tương tác chi tiết',
        free_force_graph: 'Mạng lưới bóng tròn tự do bay lơ lửng ngẫu nhiên',
        simple_list: 'Danh sách bảng tĩnh cuộn dọc thông thường'
      }),
      emotionalImpactScore: score('Mức độ gắn kết cảm xúc của người chơi khi thấy mỗi nhân vật đều có dây mơ rễ má và ân oán tình thù trong Hẻm 1102?', [
        'Không quan tâm cốt truyện',
        'Biết thêm cho vui',
        'Thấy hẻm sống động hơn',
        'Rất xúc động, gắn bó như người thật ngoài đời',
        'Tuyệt đỉnh nhập vai, thôi thúc người chơi đưa tiệm gà đến cái kết trọn vẹn'
      ])
    }
  });

  console.log(JSON.stringify(res.answers, null, 2));
}

run().catch(console.error);
