//--------------- 変数---------------
// フィールドの大きさを指定
const field_x = 10;
const field_y = 25;
const block_size = 25;
// フィールドの配列を1次元配列として定義
let field = [];
//設定
let ARR = 1;
let DAS = 6;
let SDF = 1;
let Line_time = 10;
let Line_time_now = 0;
// fps関係
let fps = 0;
let fpscount = 0;
let fpsTime = Date.now();
let now = Date.now();
//T-spin用
let tspin_type = 0;
let tspin_position = 0;
const tspin_mini = [
 [[0,0],[0,2]],
 [[0,2],[2,2]],
 [[2,0],[2,2]],
 [[0,0],[2,0]]
];
// ミノ
const tet_size = 4;
let tet_type = 0;
let tet_mino;
let tet_dir = 0;
let tet_x;
let tet_y;
let tet_ghost = 15;
//システム用
let tet_gameloop = 0;
let Tetris_nova = '通常';
let falling = 0;
let fall_speed = 60;
let move = 0;
let new_mino;
let xx;
let yy;
//ロックダウン
let rock_down = 0;
let rock_down_cancel = 0;
//エフェクト
let PC = [];
let effect = {
line : 0,
PC : 0,
ren : 0,
};
let effect_time = {
line : 0,
ren : 0,
PC : 0,
};
const effect_list = [
'single',
'double',
'triple',
'tetris',
'T-spin mini',
'T-spin single',
'T-spin double',
'T-spin double',
'T-spin triple',
'T-spin triple'

];
//消去判定用
let delete_mino = [];
//ネクスト
let next = [];
let next_position = 0;
//ホールド
let tet_hold = 0;
let _hold = 0;
//回転用
const tet_SRS = [
[0,0],[0,-1],[-1,-1],[2,0],[2,-1],
[0,0],[0,1],[1,1],[-2,0],[-2,1],
[0,0],[0,1],[-1,1],[2,0],[2,1],
[0,0],[0,-1],[1,-1],[-2,0],[-2,-1],
[0,0],[0,-2],[0,1],[1,-2],[-2,1],
[0,0],[0,-1],[0,2],[-2,-1],[1,2],
[0,0],[0,2],[0,-1],[-1,2],[2,-1],
[0,0],[0,-2],[0,1],[2,1],[-1,-2]
]
//ミノの定義
const tet_types = [
//空白
[],
//I
[
  [0,0,0,0],
  [1,1,1,1],
  [0,0,0,0],
  [0,0,0,0]
 ],
//O
 [
  [0,1,1,0],
  [0,1,1,0],
  [0,0,0,0],
  [0,0,0,0]
 ],
//S
 [
   [0,1,1,0],
   [1,1,0,0],
   [0,0,0,0],
   [0,0,0,0]
 ],
//Z
 [
   [1,1,0,0],
   [0,1,1,0],
   [0,0,0,0],
   [0,0,0,0]
 ],
//L
 [
   [0,0,1,0],
   [1,1,1,0],
   [0,0,0,0],
   [0,0,0,0]
 ],
//J
 [
   [1,0,0,0],
   [1,1,1,0],
   [0,0,0,0],
   [0,0,0,0]
 ],
//T
 [
   [0,1,0,0],
   [1,1,1,0],
   [0,0,0,0],
   [0,0,0,0]
 ]
];

let tet_colors = [
'',
'#8cf5ff',
'#fffc30',
'#75fc3a',
'#f72a23',
'#ff8c00',
'#0048ff',
'#f314ff',
'#5c5c5c'
]
//---------------キャンバス---------------
//フィールド
const canvas_x = block_size * field_x;
const canvas_y = block_size * field_y;
const canvasId = document.getElementById('canvas');
const conText = canvas.getContext("2d");
canvas.width = canvas_x;
canvas.height = canvas_y;
//ホールド用キャンバス
const canvas_hold_x = block_size * 4.5;
const canvas_hold_y = block_size * 2.5;
const canvasid = document.getElementById('ca_hold');
const canvas_hold = ca_hold.getContext("2d");
ca_hold.width = canvas_hold_x;
ca_hold.height = canvas_hold_y;
//ネクスト用キャンバス
const canvas_next_x = block_size * 4.5;
const canvas_next_y = block_size * 12.5;
const canvasID = document.getElementById('ca_next');
const canvas_next = ca_next.getContext("2d");
ca_next.width = canvas_next_x;
ca_next.height = canvas_next_y;
//キー判定用
let key = {
up : 0,
down : 0,
left : 0,
right : 0,
Rleft : 0,
Rright : 0,
hold : 0,
};
let push = {
up : 0,
down : 0,
left : 0,
right : 0,
Rleft : 0,
Rright : 0,
}

const field_h = 20 * block_size;
//---------------関数----------------
//ネクスト描画
function draw_next(){
canvas_next.lineWidth = 0;
canvas_next.clearRect(0,0,canvas_next_x,canvas_next_y);
  for(let i = 0; i < 5; i++){
   var free2 = next[i]
   var free = tet_types[free2];
    for(let y = 0; y < tet_size; y++){
      for(let x = 0; x < tet_size; x++){
        if(free[y][x]){
         draw_hold_next(free2);
         var px = (x + xx) * block_size;
         var py = (y + yy) * block_size + i * block_size * 2.5 + next_position;
         canvas_next.globalAlpha = 1.0;
         canvas_next.fillStyle = tet_colors[free2];
         canvas_next.fillRect(px, py, block_size, block_size);
        }
      }
    }
  }
}

//ホールド描画
function draw_hold(){
canvas_hold.clearRect(0,0,canvas_hold_x,canvas_hold_y);
var free = tet_types[tet_hold];
  if(tet_hold){
    for(let y = 0; y < tet_size; y++){
      for(let x = 0; x < tet_size; x++){
        if(free[y][x]){
         draw_hold_next(tet_hold);
         var px = (x + xx) * block_size;
         var py = (y + yy) * block_size;
         canvas_hold.globalAlpha = 1.0;
         canvas_hold.fillStyle = tet_colors[tet_hold];
         canvas_hold.fillRect(px, py, block_size, block_size);
        }
      }
    }
  }
}

function draw_hold_next(type){
  if(type == 1){
    xx = 0.25;
    yy = -0.25;
  }else{
    if(type == 2){
     xx = 0.25;
     yy = 0.25;
    }else{
     xx = 0.5;
     yy = 0.25;
    }
  }
}
///ブロック描画
function draw_block(x,y,type){
 let px = x * block_size;
 let py = y * block_size;
  if(type){
    if(type < 9){
       conText.globalAlpha = 1.0;
       conText.fillStyle = tet_colors[type];
    } else {
     conText.globalAlpha = 0.5;
     conText.fillStyle = tet_colors[tet_type];
    }
    conText.fillRect(px, py, block_size, block_size);
   }else{
//グリッド
     if(py > 120){
      conText.strokeStyle = "black";
      conText.lineWidth = 1;
      conText.strokeRect(px, py, block_size,block_size);
     }
   }
}
//フィールド描画
function draw_field(){
  for(let y = 0; y < field_y; y++){
    for(let x = 0; x < field_x; x++){
      if(Tetris_nova == 'gameover'){
        if(field[y][x]){
         draw_block(x,y,8)
        }else{
         draw_block(x,y,0)
        }
      }else{
       draw_block(x,y,field[y][x])
      }
    }
  }
}
//ミノ描画
function draw_mino(){
  for(let y = 0; y < tet_size; y++){
    for(let x = 0; x < tet_size; x++){
      if(tet_mino[y][x]){
        if(Tetris_nova == 'gameover'){
         draw_block(tet_x + x, tet_y + y, 8)
         conText.globalAlpha = 1.0;
        }else{
         draw_block(tet_x + x, tet_y + y, tet_type)
         draw_block(tet_x + x,tet_ghost + y,9);
         conText.globalAlpha = 1.0;
        }
      }
    }
  }
}
//移動できるか
function check_move(mx,my,new_tet){
  for(let y = 0; y < tet_size; y++){
    for(let x = 0; x < tet_size; x++){
      if(new_tet[y][x]){
       var nx = mx + tet_x + x;
       var ny = my + tet_y + y;
        if(nx < 0
         || nx >= field_x
         || ny >= field_y
         || field[ny][nx]
         )
         {
         return false;
        }
      }
    }
  }
return true;
}

//回転
function rota(dir){
new_mino = [];
  if(tet_type == 1 || tet_type == 2){
   if(tet_type == 1){
    for(let y = 0; y < tet_size; y++){
    new_mino[y] = [];
      for(let x = 0; x < tet_size; x++){
        if(dir == 1){
        new_mino[y][x] = tet_mino[tet_size - 1 - x][y];
        }else{
        new_mino[y][x] = tet_mino[x][tet_size - 1 - y];
        }
      }
    }
   }else{
    new_mino = tet_mino;
   }
  }else{
   for(let y = 0; y < tet_size; y++){
    new_mino[y] = [];
     for(let x = 0; x < tet_size; x++){
      new_mino[y][x] = 0;
     }
   }
   if(dir == -1){
    new_mino[0][0] = tet_mino[0][2];
    new_mino[0][1] = tet_mino[1][2];
    new_mino[0][2] = tet_mino[2][2];
    new_mino[1][0] = tet_mino[0][1];
    new_mino[1][1] = tet_mino[1][1];
    new_mino[1][2] = tet_mino[2][1];
    new_mino[2][0] = tet_mino[0][0];
    new_mino[2][1] = tet_mino[1][0];
    new_mino[2][2] = tet_mino[2][0];
   }else{  
    new_mino[0][0] = tet_mino[2][0];
    new_mino[0][1] = tet_mino[1][0];
    new_mino[0][2] = tet_mino[0][0];
    new_mino[1][0] = tet_mino[2][1];
    new_mino[1][1] = tet_mino[1][1];
    new_mino[1][2] = tet_mino[0][1];
    new_mino[2][0] = tet_mino[2][2];
    new_mino[2][1] = tet_mino[1][2];
    new_mino[2][2] = tet_mino[0][2];
   }
  }
}

//ネクスト
function add_next(){
let n = ['1','2','3','4','5','6','7'];
for(let i = 0; i < 7; i++){
let random = Math.floor(Math.random() * n.length);
next.push(n[random]);
n.splice(random, 1);
 }
}

//ミノセット
function set_mino(type){
 tet_x = 3;
 tet_y = 3;
 tet_dir = 0;
 tet_mino = tet_types[type];
 rock_down = 0;
 next_position = block_size * 3.5;
  if(!check_move(0,0,tet_mino)){
   Tetris_nova = 'gameover';
  }
}
//ロックダウンキャンセル
function rock_downcancel(){
  if(rock_down_cancel < 15){
   rock_down = 0;
   rock_down_cancel++;
  }
}
//tspin用
function spin_t(x,y){
  if(x < 0
         || x >= field_x
         || y >= field_y
         || field[y][x]
         )
  {
   return true;
  }
}
//----------------ゲームループ---------------
function gameloop(){
now = Date.now();
  if(Tetris_nova == '通常'){
   var free = 0;
   //ミノセット
    if(!tet_type){
     tet_type = next.shift();
     set_mino(tet_type);
     _hold = 0;
    }
    //ネクストセット
    if(next.length < 30){
     add_next();
    }
//---------------操作---------------
//ホールド
  if(key.hold){
    if(_hold == 0){
     _hold = 1;
      if(tet_hold){
       var free = tet_hold;
       tet_hold = tet_type;
       tet_type = free;
       set_mino(tet_type);
      }else{
       tet_hold = tet_type;
       tet_type = next.shift();
       set_mino(tet_type);
      }
    }
  }
//ソフトドロップ
    if(key.down){
      for(let i = 0; i < SDF; i++){
        if(check_move(0,1,tet_mino)){
         tet_y++;
         falling = 0;
        }
      }
    }
//横操作
    if(key.left && key.right){
      if(push.left < 1){
       move = -1;
       push.left++;
    }
    if(push.right < 1){
     move = 1;
     push.right++;
    }
  }else{
   move = 0;
    if(key.left){
     move = -1;
     push.left++;
    }else{
     push.left = 0;
    }
    if(key.right){
     move = 1;
     push.right++;
    }else{
     push.right = 0;
    }
  }
//横移動
  if(move){
    if(move == 1){
     free = ARR * (DAS < push.right) + (push.right <= 1);
      for(let i = 0; i < free; i++){
        if(check_move(1,0,tet_mino)){
         tet_x++;
         rock_downcancel();
        }
      }
    }else{
     free = ARR * (DAS < push.left) + (push.left <= 1);
      for(let i = 0; i < free; i++){
        if(check_move(-1,0,tet_mino)){
         tet_x--;
         rock_downcancel();
        }
      }
    }
  }

//回転操作
  free = 0;
  if(key.Rleft){
    if(push.Rleft == 0){
     free = -1;
    }
   push.Rleft = 1;
  }else{
   push.Rleft = 0;
  }
  if(key.Rright){
    if(push.Rright == 0){
     free = 1;
    }
   push.Rright = 1;
  }else{
   push.Rright = 0;
  }
  //回転
  if(free){
   tspin_type = 0;
   rock_downcancel();
   var free2 = (tet_dir + (free == -1) * 3) % 4 * 5 + (tet_type == 1) * 20;
   rota(free);
   tet_dir = (free + 4 + tet_dir) % 4;
   var free3 = 0;
    for(let i = 0; i < 5; i++){
      if(free3 == 0){
       var free6 = free2 + i;
       var free4 = tet_SRS[free6][0] * free;
       var free5 = tet_SRS[free6][1] * free;
        if(check_move(free5,free4,new_mino)){
         free3 = 1;
         tet_x = tet_x + free5;
         tet_y = tet_y + free4;
         tet_mino = new_mino;
        }
      }
    }
    if(free3 == 0){
     tet_dir = (0 - free + 4 + tet_dir) % 4;
    }else{
     //T-spin判定
      if(tet_type == 7){
       var t_3 = 0;
        for(let y = 0; y < 2; y++){
          for(let x = 0; x < 2; x++){
           var t_1 = tet_x + x * 2;
           var t_2 = tet_y + y * 2;
            if(spin_t(t_1,t_2)){
             t_3++;
            }
          }
        }
        if(2 < t_3){
         tspin_position = [tet_x,tet_y];
         var t_1 = tspin_mini[tet_dir][0];
         var t_2 = tspin_mini[tet_dir][1];
          if(spin_t(t_1[1] + tet_x,t_1[0] + tet_y) && spin_t(t_2[1] + tet_x,t_2[0] + tet_y)){
           tspin_type = 2;
          }else{
           tspin_type = 1;
          }
        }
      }
    }
  }
//ゴースト位置特定
  free = 0;
  while(check_move(0,free + 1,tet_mino)) free++;
  tet_ghost = tet_y + free;
  free = 0;
//自然落下
  if(check_move(0,1,tet_mino)){
   falling++;
    if(falling > fall_speed){
     falling = 0;
     tet_y++;
    }
  }else{
   rock_down++;
   falling = 0;
    if(rock_down > fall_speed){
     free = 1;
     rock_down = 0;
    }
  }
  if(key.up){
    if(push.up < 1){
     push.up = 1;
     free = 1;
    }
  } else {
    push.up = 0;
  }
//設置
  if(free){
    for(let y = 0; y < tet_size; y++){
      for(let x = 0; x < tet_size; x++){
        if(tet_mino[y][x]){
         field[tet_ghost + y][tet_x + x] = tet_type;
        }
      }
    }
   tet_type = 0;
   falling = 0;
    for(let y = 24; y > 0; y--){
     free = 0;
      for(let x = 0; x < field_x; x++){
        if(field[y][x]){
         free++;
        }
      }
       if(free == 10){
        delete_mino.push(y);
         for(let x = 0; x < field_x; x++){
          field[y][x] = 0;
         }
       }
    }
   var line = delete_mino.length;
    if(line){
     Line_time_now = 0;
     Tetris_nova = 'ライン消去';
//---------------ボーナス---------------
     effect_time.line = Date.now();
     var free = 0;
      for(let y = 0; y < field_y; y++){
        for(let x = 0; x < field_x; x++){
          free = free + field[y][x];
        }
      }
      if(free == 0){
       effect.PC = 'Perfect clear';
       effect_time.PC = Date.now();
      }
      if(tspin_type){
       effect.line = effect_list[2 + tspin_type * 2];
      }else{
       effect.line = effect_list[line - 1];
      }

    }
  }
}else{
  if(Tetris_nova == 'ライン消去'){
　　if(Line_time_now > Line_time){
     var free2 = delete_mino.length;
     for(let i = 0; i < free2; i++){
       var free = delete_mino.pop();
       for(let y = free; y > 0; y--){
         for(let x = 0; x < field_x; x++){
          field[y][x] = field[y - 1][x];
         } 
       }
     }
     Tetris_nova = '通常';
    }else{
    Line_time_now++;
    }
  }
}
//---------------描画---------------
//ネクストポジション
if(next_position > 0){
next_position = next_position - 9.73;
}
//キャンバスをリセット
conText.clearRect(0,0,canvas_x,canvas_y);
//背景
conText.globalAlpha = 0.5;
conText.fillStyle = "#000000";
conText.fillRect(0, 5 * block_size, canvas_x, field_h);
//フィールド描画
draw_field();
//ミノ描画
if(tet_type){
draw_mino();
}
//ネクスト描画
draw_next();
//ホールド描画
draw_hold();
//エフェクト
var free = 0;
if(effect.line == 0){
 free = '';
}else{
 free = effect.line;
  if(now - effect_time.line > 1000){
   effect.line = 0;
  }
}
document.querySelector('#e_line').textContent = free;
var free = 0;
if(effect.PC == 0){
 free = 'none';
}else{
 free = 'block';
  if(now - effect_time.PC > 5000){
   effect.PC = '0';
  }
}
document.getElementById("e_PC").style.display = free;
//fpsカウントをプラス
fpscount++
//---------------FPS計測---------------
 document.querySelector('#fps').textContent = fps;
  if(now - fpsTime > 1000){
   fps = fpscount;
   fpscount = 0;
   fpsTime = now;
  }
  if(tet_gameloop){
 requestAnimationFrame(gameloop);
  }
}
//----------初期化----------
function reset(){
var start_time = Date.now();
//ゲームループ終了
//tet_gameloop = 0;
//データリセット
tet_type = 0;
next = [];
tet_hold = 0;
//ネクスト
add_next();
//フィールドの初期化
field = [];
for(let y = 0; y < 30; y++){
field[y] = [];
for(let x = 0; x < field_x; x++){
field[y][x] = 0;
 }
}
tet_gameloop = 1;
Tetris_nova = '通常';

}
//---------------実行部---------------
  //キーイベント
  document.addEventListener('keydown', (event) => {
    if(event.key == 'ArrowUp'){
     key.up = 1;
    }
    if(event.key == 'ArrowDown'){
     key.down = 1;
    }
    if(event.key == 'ArrowLeft'){
     key.left = 1;
    }
    if(event.key == 'ArrowRight'){
     key.right = 1;
    }
    if(event.key == 'z'){
     key.Rleft = 1;
    }
    if(event.key == 'x'){
     key.Rright = 1;
    }
    if(event.key == 'c'){
     key.hold = 1;
    }
    if(event.key == 'v')
     reset();
  });
   document.addEventListener('keyup', (event) => {
    if(event.key == 'ArrowUp'){
     key.up = 0;
    }
    if(event.key == 'ArrowDown'){
     key.down = 0;
    }
    if(event.key == 'ArrowLeft'){
     key.left = 0;
    }
    if(event.key == 'ArrowRight'){
     key.right = 0;
    }
    if(event.key == 'z'){
     key.Rleft = 0;
    }
    if(event.key == 'x'){
     key.Rright = 0;
    }
    if(event.key == 'c'){
     key.hold = 0;
    }
  });

reset();
requestAnimationFrame(gameloop);
