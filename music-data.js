/*
 * 候选专辑清单：确定最终名单后可删改、调整顺序。
 * cover: 本站的封面缩略图路径。来源和对应版本见 music-covers/SOURCES.md。
 * spotifyUrl: 填 Spotify 的普通专辑分享链接即可，页面会自动转成官方嵌入播放器。
 * links: 可填其他正版平台的公开专辑页面链接；不需要账号或密码。
 * 《伟大的渺小》词曲署名参考：https://en.wikipedia.org/wiki/Message_in_a_Bottle_(album)#Track_listing
 * 不要把未获公开传播许可的音频文件放入公开网站。
 */
window.MUSIC_ALBUMS = [
  { id: "great-small", title: "伟大的渺小", artist: "林俊杰", artistEn: "JJ LIN", colors: ["#405b6e", "#a7b8bb", "#daa595"], pattern: "sun", cover: "music-covers/great-small.jpg", note: "2017 · 11 首歌曲。先把这张专辑做成试听样板，之后可以换成你自己的推荐语。", tracks: [
    { title: "圣所", lyricist: "张思尔", composer: "林俊杰", duration: "3:49", spotifyId: "6ilHdm1oBzsR5lY7vlPFhx" },
    { title: "伟大的渺小", lyricist: "小寒", composer: "林俊杰", duration: "4:37", spotifyId: "1P2RxojrM3KEoKgM7pbc9i" },
    { title: "穿越", lyricist: "林雨果", composer: "林俊杰", duration: "4:37", spotifyId: "2nx9pgvvBvRjVVTjvEWhGD" },
    { title: "四点四十四", lyricist: "张怀秋", composer: "林俊杰", duration: "3:47", spotifyId: "4UFrZFTWS6I62p3RG5ejBI" },
    { title: "我继续", lyricist: "方文山", composer: "林俊杰", duration: "4:40", spotifyId: "1Pfuo0A9rUL1LQHhMG8RXg" },
    { title: "剪云者", lyricist: "易家扬", composer: "林俊杰", duration: "3:35", spotifyId: "1sRmhGuriRYQoMjZajl3gm" },
    { title: "黑夜问白天", lyricist: "易家扬", composer: "林俊杰", duration: "4:52", spotifyId: "5KNh5YQgfduzV4028Cfh3J" },
    { title: "丹宁执着 (feat. 消除联萌)", lyricist: "周信廷", composer: "林俊杰", duration: "4:13", spotifyId: "5QKx31CqJ6WgafgRJIf84b" },
    { title: "身为风帆", lyricist: "姚若龙", composer: "林俊杰", duration: "3:57", spotifyId: "4e84WMsS2QjryysKnL0hcy" },
    { title: "小瓶子", lyricist: "林俊杰、林怡凤", composer: "林俊杰", duration: "4:12", spotifyId: "6L8Iv2orxcaVQndiVGWMdc" },
    { title: "Until The Day", lyricist: "林俊杰", composer: "林俊杰", duration: "4:35", spotifyId: "3EsdgnpdRxecbzU4Ccr91F" }
  ], spotifyUrl: "https://open.spotify.com/album/0L4EfOigWI6pSjJlJI3yba", links: [] },
  { id: "dialogue", title: "和自己对话", artist: "林俊杰", artistEn: "JJ LIN", colors: ["#829b83", "#d6d4bd", "#b5a7ad"], pattern: "type", cover: "music-covers/dialogue.jpg", note: "这张专辑的私人推荐语，等最终名单确定后再写下。", tracks: [], spotifyUrl: "", links: [] },
  { id: "ye-hui-mei", title: "叶惠美", artist: "周杰伦", artistEn: "JAY CHOU", colors: ["#534940", "#b2a18c", "#b78e79"], pattern: "bars", cover: "music-covers/ye-hui-mei.jpg", note: "这张专辑的私人推荐语，等最终名单确定后再写下。", tracks: [], spotifyUrl: "", links: [] },
  { id: "fantasy", title: "范特西", artist: "周杰伦", artistEn: "JAY CHOU", colors: ["#554961", "#b6a2be", "#e5c7a9"], pattern: "type", cover: "music-covers/fantasy.jpg", note: "这张专辑的私人推荐语，等最终名单确定后再写下。", tracks: [], spotifyUrl: "", links: [] },
  { id: "greatest-works", title: "最伟大的作品", artist: "周杰伦", artistEn: "JAY CHOU", colors: ["#596c69", "#c4ccbb", "#d5a985"], pattern: "sun", cover: "music-covers/greatest-works.jpg", note: "这张专辑的私人推荐语，等最终名单确定后再写下。", tracks: [], spotifyUrl: "", links: [] },
  { id: "against-the-light", title: "逆光", artist: "孙燕姿", artistEn: "STEF SUN", colors: ["#a4775d", "#ead0a7", "#e1aa75"], pattern: "sun", cover: "music-covers/against-the-light.jpg", note: "这张专辑的私人推荐语，等最终名单确定后再写下。", tracks: [], spotifyUrl: "", links: [] },
  { id: "dancing-van-gogh", title: "跳舞的梵谷", artist: "孙燕姿", artistEn: "STEF SUN", colors: ["#3d607d", "#b4a78b", "#d99c6d"], pattern: "bars", cover: "music-covers/dancing-van-gogh.jpg", note: "这张专辑的私人推荐语，等最终名单确定后再写下。", tracks: [], spotifyUrl: "", links: [] },
  { id: "pure-sister", title: "纯妹妹", artist: "单依纯", artistEn: "YICHUN", colors: ["#a0778d", "#dfb7b5", "#9ea9b3"], pattern: "type", cover: "music-covers/pure-sister.jpg", note: "这张专辑的私人推荐语，等最终名单确定后再写下。", tracks: [], spotifyUrl: "", links: [] }
];
