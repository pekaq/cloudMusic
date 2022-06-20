window.onload = function() {
  // 搜索框获得焦点
  $("#search").focus(function() {
    $(this).prop('placeholder', '');
  })
  
  // 搜索框失去焦点
  $("#search").blur(function() {
    $(this).prop('placeholder', '🔍音乐搜索');
    $(this).val('');
  })

  // 登录
  $("#box header i").eq(0).click(function() {
    $("#loginbox").css('display', 'block');
  })
  $("#loginbox div p button").click(function() {
    $("#loginbox").css('display', 'none');
    if ($("#loginbox div input[type='checkbox']").prop('checked') == false) {
      $("#loginbox div input[type='text']").val("");
      $("#loginbox div input[type='password']").val("");
    }
  })

  // 皮肤
  var skinswitch = 1
  $("#box header i").eq(1).click(function() {
    switch (skinswitch) {
      case 1: $("#skinbox").css('display', 'block');
              skinswitch = 0; break;
      case 0: $("#skinbox").css('display', 'none');
              skinswitch = 1; break;
    }
  })
  $("#skinbox span").click(function() {
    // console.log($(this).css("background-color"));
    var bgc = $(this).css("background-color")
    $("#box").css('backgroundColor', bgc);
    $("#skinbox").css('display', 'none');
    skinswitch = 1;
  })

  // 播放与暂停
  var myaudio = $("audio").get(0)
  // console.log(myaudio);
  var playbtn = false
  $("#box footer i").eq(1).click(function() {
    // console.log(1);
    if (playbtn == false) {
      $("#box footer i").eq(1).prop('class', 'icon iconfont icon-tianchongxing-');
      playbtn = true;
      myaudio.play();
      playRotate();
    }
    else {
      $("#box footer i").eq(1).prop('class', 'icon iconfont icon-zanting');
      playbtn = false;
      myaudio.pause();
      clearInterval(playTimer);
    }
    timeupdate();
    // console.log(playbtn);
  })

  // 播放唱片旋转动画
  var playTimer = null
  var angle = 0
  function playRotate() {
    playTimer = setInterval(() => {
      angle += 0.25
      $("#musicImg").css('transform', 'rotate(' + angle + 'deg)');
      // console.log("定时器启动");
    },50);
  }

  // 静音与非静音
  var currVol = myaudio.volume
  $("#box footer i").eq(3).click(function() {
    if (myaudio.volume != 0) {
      currVol = myaudio.volume;
      $("#box footer i").eq(3).prop('class', 'icon iconfont icon-jingyin');
      myaudio.volume = 0;
      $("#box footer input").eq(1).val(0);
    }
    else {
      $("#box footer i").eq(3).prop('class', 'icon iconfont icon-xiangling');
      myaudio.volume = currVol;
      $("#box footer input").eq(1).val(100*currVol);
    }
  })

  // 音量动态调节
  $("#box footer input").eq(1).on('input', function() {
    myaudio.volume = $(this).val()/100;
    if ($(this).val() == 0) {
      $("#box footer i").eq(3).prop('class', 'icon iconfont icon-jingyin');
    }
    else {
      $("#box footer i").eq(3).prop('class', 'icon iconfont icon-xiangling');
    }
  })

  // 渲染音乐总长度数据
  myaudio.oncanplay = function() {
    $("#box footer input").eq(0).prop('max', this.duration);
    $("#box footer span").eq(1).text(formateSeconds(this.duration));
  }

  // 处理时长秒数
  function formateSeconds(seconds) {
    var secs = Math.round(seconds)
    var mins = parseInt(secs/60)
    var s = secs % 60
    return (mins > 9? mins:('0'+mins)) + ":" + (s > 9?s:('0'+s));
  }

  // 制作动态音乐进度
  function timeupdate() {
    myaudio.ontimeupdate = function() {
      $("#box footer input").eq(0).val(this.currentTime);
      $("#box footer span").eq(0).text(formateSeconds(this.currentTime));

      if (ifscroll == false) {
        syncLyric();
        autoSetLocation();
      }
      // console.log(ifscroll);
      // console.log("已更新时间");

      renderDeskLyric();
    }
  }
  timeupdate();

  // 音乐进度条拖动功能
  $("#box footer input").eq(0).mousedown(function() {
    myaudio.ontimeupdate = null;
  })
  $("#box footer input").eq(0).on('mousemove', function() {
    // console.log($("#box footer input").eq(0).val());
    $("#box footer span").eq(0).text(formateSeconds($("#box footer input").eq(0).val()));
  })
  $("#box footer input").eq(0).mouseup(function() {
    myaudio.currentTime = $("#box footer input").eq(0).val();
    // console.log("鼠标弹起");
    console.log(myaudio.currentTime);

    autoSetLocation();
    syncLyric();
    timeupdate();
  })

  // 播放模式切换
  var pattern = 1
  $("#box footer i").eq(4).click(function() {
    switch (pattern) {
      case 1: $("#box footer i").eq(4).prop({'class':'icon iconfont icon-suijibofang', 'title':'随机播放'});
              pattern = 2; break;
      case 2: $("#box footer i").eq(4).prop({'class':'icon iconfont icon-danquxunhuan', 'title':'单曲循环'});
              pattern = 0; break;
      case 0: $("#box footer i").eq(4).prop({'class': 'icon iconfont icon-liebiaoshunxu', 'title':'顺序播放'});
              pattern = 1; break;
    }
  })

  // 桌面歌词显隐
  var deskswitch = 1
  $("#box footer i").eq(5).click(function() {
    switch (deskswitch) {
      case 1: $("#desktop").css('display', 'block');
              deskswitch = 0; break;
      case 0: $("#desktop").css('display', 'none');
              deskswitch = 1; break;
    }
  })

  // 播放列表显隐
  var playswitch = 1
  $("#box footer i").eq(6).click(function() {
    switch (playswitch) {
      case 1: $("#listsbox").css('display', 'block');
              playswitch = 0; break;
      case 0: $("#listsbox").css('display', 'none');
              playswitch = 1; break;
    }
  })

  // 播放列表与历史记录切换
  $(".top ul li").eq(0).click(function() {
    $(this).css({'background-color':'aquamarine'});
    $(".top ul li").eq(1).css({'background-color':'white'});
    $(".lists").eq(1).css({'display':'none'});
    $(".lists").eq(0).css({'display':'block'});
  })
  $(".top ul li").eq(1).click(function() {
    $(this).css({'background-color':'aquamarine'});
    $(".top ul li").eq(0).css({'background-color':'white'});
    $(".lists").eq(0).css({'display':'none'});
    $(".lists").eq(1).css({'display':'block'});
  })

  // 播放列表关闭按钮
  $(".top button").click(function() {
    $("#listsbox").css('display', 'none');
    playswitch = 1;
  })

  // 历史记录清空按钮
  $(".lists span").eq(1).text($("#historyList").find("li").length);
  $(".lists button").click(function() {
    console.log("清除历史记录");
    $("#historyList").find("li").remove();
    $(".lists span").eq(1).text($("#historyList").find("li").length);
  })

  // 总共 n 首
  $(".lists span").eq(0).text(musicData.length);

  // console.log(musicData);
  // 音乐列表渲染
  $.each(musicData, function(index, item) {
    var li = `<li>${item.song}&nbsp;&nbsp;--&nbsp;&nbsp;${item.singer}&nbsp;&nbsp;--&nbsp;&nbsp;${item.album}</li>`
    $(".lists").eq(0).append(li);
  })

  // 列表中切歌
  var musicIdx = 0
  $(".lists").eq(0).find("li").click(function() {
    musicIdx = $(this).index() - 1;
    musicSwitch();
    myaudio.autoplay = playbtn;
    updateLyric();
    updateMsg();
  })

  // 列表切歌函数
  function musicSwitch() {
    myaudio.src = "../public/" + musicData[musicIdx].url;
    $(".left div img").prop('src', musicData[musicIdx].cover);
    $(".lists").eq(0).find("li").css('background-color','white');
    $(".lists").eq(0).find("li").eq(musicIdx).css('background-color','pink');
  }
  musicSwitch();

  // 上一首
  var preMusicArr = []
  $("#box footer i").eq(0).click(function() {
    if (preMusicArr.length == 0) {
      switchTool();
    }
    else {
      musicIdx = preMusicArr.pop();
      nextsong();
    }
  })

  // 下一首
  $("#box footer i").eq(2).click(function() {
    switchTool();
  })

  // 下一首切歌工具
  function nextsong() {
    musicSwitch();
    // console.log(playbtn);
    myaudio.autoplay = playbtn;
    timeupdate();
    updateLyric();
    $(".right div ul").scrollTop(0);
    updateMsg();
  }

  // 播放结束自动切歌
  myaudio.onended = function() {
    switchTool();
  }

  // 切歌核心组件
  function switchTool() {
    switch (pattern) {
      case 1:
        // console.log("顺序", pattern);
        preMusicArr.push(musicIdx);
        musicIdx++;
        if (musicIdx == musicData.length) {
          musicIdx = 0;
        }
        nextsong();
        break;
      case 2:
        // console.log("随机", pattern);
        var suijiVal = parseInt(Math.random()*musicData.length)
        while (musicIdx == suijiVal) {
          suijiVal = parseInt(Math.random()*musicData.length);
        }
        preMusicArr.push(musicIdx);
        musicIdx = suijiVal;
        nextsong();
        break;
      case 0:
        // console.log("单曲", pattern);
        nextsong();
        break;
    }
  }

  // 更新历史记录
  myaudio.onplay = function() {
    addHistoryRecord();
  }
  function addHistoryRecord() {
    var li = $("#musicList li").eq(musicIdx).clone()
    li.css('background', 'white');
    if (($("#historyList li").filter(":contains(" + li.text() + ")")).length == 0) {       
      $("#historyList").append(li);
      li.attr('idx',musicIdx);
    }
    $(".lists span").eq(1).text($("#historyList").find("li").length);
  }
  
  // 历史记录点击播放
  $("#historyList").on("click", function(e) {
    // console.log(e.target);
    if (e.target == $("#historyList p button")) {
      musicIdx = e.target.getAttribute("idx");
      musicSwitch();
      myaudio.autoplay = playbtn;
      timeupdate();
      updateLyric();
      updateMsg();
    }
  })

  // 渲染歌词
  // console.log(lrcs);
  function updateLyric() {
    $(".right div ul").empty();
    var songname = musicData[musicIdx].lyric
    var currLyric = null
    lrcs.forEach(function(item, idx) {
      // console.log(idx, item);
      if (item.song == songname) {
        currLyric = item.lyric;
      }
    })
    $.each(currLyric, function(index, item) {
      var li = `<li time=${item.time}>${item.lineLyric}</li>`
      $(".right div ul").append(li);
    })
    var song = musicData[musicIdx].song
    var album = musicData[musicIdx].album
    var singer = musicData[musicIdx].singer
    var source = musicData[musicIdx].source
    $(".right div h1").text(song);
    $(".right div span a").eq(0).text(album);
    $(".right div span a").eq(1).text(singer);
    $(".right div span a").eq(2).text(source);
  }
  updateLyric();

  // 同步歌词
  var syncTool
  function syncLyric() {
    syncTool = function() {
      var sec = parseInt(myaudio.currentTime)
      // console.log(sec);
      for (var i=0; i<$(".right div ul li").length; i++) {
        var li = $(".right div ul li").eq(i)
        if (sec == li.attr("time")) {
          $(".right div ul li").css({'color':'black', 'fontWeight':'normal'});
          li.css({'color':'red', 'fontWeight':'700'});

          // 同步滚动
          $(".right div ul").scrollTop((i-3)*40);
        }
      }
    }
    syncTool();
  }

  // 歌词界面滚动事件
  // 手动滚动与自动滚动冲突解决方案
  var ifscroll = false
  var timer = null
  $(".right div ul").on('wheel', function() {
    console.log(1);
    clearTimeout(timer);
    ifscroll = true;
    syncTool = null;
    timer = setTimeout(function() {
      autoSetLocation();
      syncLyric();
      ifscroll = false;
      console.log("5秒");
    },5000)
  })

  // 自动定位歌词位置
  function autoSetLocation() {
    if (myaudio.currentTime >= $(".right div ul li").last().attr("time")) {
      var lastHeight = $(".right div ul li").length * 40;
      $(".right div ul").scrollTop(lastHeight);
  
      $(".right div ul li").css({'color':'black', 'fontWeight':'normal'});
      $(".right div ul li").last().css({'color':'red', 'fontWeight':'700'});
    }
    else {
      for (var i=0; i<$(".right div ul li").length; i++) {
        var li = $(".right div ul li").eq(i)
        if (li.attr("time") > myaudio.currentTime && $(".right div ul li").eq(0).attr("time") < myaudio.currentTime) {
          $(".right div ul li").css({'color':'black', 'fontWeight':'normal'});
          li.prev().css({'color':'red', 'fontWeight':'700'});
    
          // 同步滚动
          $(".right div ul").scrollTop((i-3)*40);
    
          break;
        }
      }
    }
  }

  // 渲染评论数据
  function updateMsg() {
    $(".bottom").empty();
    $.each(musicData[musicIdx].msg, function(index, item) {
      var pinglunUser = null
      var userPic = null
      $.each(users, function(index2, item2) {
        if (item.userId == item2.id) {
          pinglunUser = item2.name;
          userPic = item2.pic;
        }
      })
      var content = `
        <div>
          <div class="left">
            <img src="${ userPic }" alt="图片缺失">
          </div>
          <div class="right">
            <p><span>${ pinglunUser }：</span><span>${ item.megCon }</span></p>
            <p class="replyKey"><span></span><span></span></p>
            <p>
              <span id="postTime">${ item.date }</span>
              <span id="spanbox">
                <i class="icon iconfont icon-dianzan"></i>
                <button>分享</button>
                <button>回复</button>
              </span>
            </p>
          </div>
        </div>
      `
      $(".pinglun .bottom").append(content);
      var clearFloat = `<div style="clear: both;"></div>`
      $(".bottom>div").append(clearFloat);
      // console.log(item);
    })
    if ($(".replyKey").text() == "") {
      $(".replyKey").css('display','none');
    }
    $(".pinglun .top p span").text("（已有 " + $(".pinglun .bottom>div").length + " 条评论）");
  }
  updateMsg();

  // 用户登录
  var username = null
  var userphoto = null
  var userid =null
  var dengluState = false
  $("#loginbox div input[type='submit']").click(function() {
    var user = $("#loginbox div input[name='user']").val()
    var psd = $("#loginbox div input[name='psd']").val()
    console.log(user,psd);
    if (user == "" || psd == "") {
      return alert("账号或密码错误！");
    }
    else {
      $.ajax({
        url: "http://127.0.0.1:3000/denglu",
        type: "post",
        data: {user, psd},
        success: function(data) {
          console.log(data);
          dengluState = true;
          username = data[1];
          userphoto = data[2];
          userid = data[3];
          if (data[0] == 0) {
            alert("账号或密码错误!");
          }
          else {
            var replaceContent = $(`<div id="denglu"><img src="${ data[2] }" alt="图片缺失"> ${ data[1] }</div>`)
            $("#denglu").replaceWith(replaceContent);
            $("#denglu").css({
              'line-height': '50px',
              'padding': '0 20px 0 150px',
              'cursor': 'pointer',
              'color': 'white',
              'height': '50px'
            });
            $("#denglu img").css({
              'width': '30px',
              'height': '30px',
              'margin': '10px 0',
              'border-radius': '50%',
              'float': 'left'
            });
            $("#loginbox").css('display','none');
          }
        }
      })
      console.log("提交");
    }
  })

  // 记住密码
  $("#loginbox div input[type='checkbox']").click(function() {
    console.log($(this).prop('checked'));
    if ($(this).prop('checked') == true) {
      $("#loginbox div input[type='text']").attr('autocomplete', 'on');
      $("#loginbox div input[type='password']").attr('autocomplete', 'on');
    }
    else {
      $("#loginbox div input[type='text']").attr('autocomplete', 'off');
      $("#loginbox div input[type='password']").attr('autocomplete', 'off');
    }
  })

  // 弹出评论窗口
  $(".pinglun .top input").click(function() {
    if (dengluState == false) {
      return alert("请登录！");
    }
    $(".bgcbox").css('display', 'block');
  })

  // 关闭评论窗口
  $("#bibibox p button").click(function() {
    $(".bgcbox").css('display', 'none');
    $("#bibibox textarea").val("");
  })


  // 更新评论剩余字数
  $("#bibibox textarea").focus(function() {
    $("#bibibox textarea").keyup(function() {
      console.log($(this).val().length);
      $("#bibibox p span").text(85 - $(this).val().length);
    })
  })

  // 发表评论
  $("#bibibox>button").click(function() {
    if ($("#bibibox textarea").val().length == 0) {
      return alert("评论不能为空");
    }
    var now = new Date()
    var year = now.getFullYear()
    var month = now.getMonth()+1
    var date = now.getDate()
    var hours = now.getHours()
    var mins = now.getMinutes()
    var secs = now.getSeconds()
    var nowTime = year + "-" + month + "-" + date + " " + (hours>9? hours:"0"+hours) + ":" + (mins>9? mins:"0"+mins) + ":" + (secs>9? secs:"0"+secs)
    console.log(nowTime);
    var content = `
        <div>
          <div class="left">
            <img src="${ userphoto }" alt="图片缺失">
          </div>
          <div class="right">
            <p><span>${ username }：</span><span>${ $("#bibibox textarea").val() }</span></p>
            <p class="replyKey"><span></span><span></span></p>
            <p>
              <span id="postTime">${ nowTime }</span>
              <span id="spanbox">
                <i class="icon iconfont icon-dianzan"></i>
                <button>分享</button>
                <button>回复</button>
              </span>
            </p>
          </div>
        </div>
      `
    $(".pinglun .bottom").append(content);
    $(".bgcbox").css('display', 'none');
    // 更新 data.js 的 msg 数据
    var msglength = musicData[musicIdx].msg.length
    var msgpush = {
      "megId": ++msglength,
      "megCon": $("#bibibox textarea").val(),
      "date": nowTime,
      "userId": userid
    }
    musicData[musicIdx].msg.push(msgpush);
    $(".pinglun .top p span").text("（已有 " + $(".pinglun .bottom>div").length + " 条评论）");
  })

  // 桌面歌词渲染
  function renderDeskLyric() {
    lrcs.forEach(function(item, idx) {
      if (item.song == musicData[musicIdx].lyric) {
        $.each(item.lyric, function(index, item2) {
          if (myaudio.currentTime <= item.lyric[0].time) {
            $("#desktop p").empty();
            $("#desktop p").text(item.lyric[0].lineLyric);
            $("#desktop p").css('color', 'black');
          }
          else {
            if (myaudio.currentTime > item2.time) {
              $("#desktop p").empty();
              $("#desktop p").text(item2.lineLyric);
              $("#desktop p").css('color', 'red');
            }
          }
        })
      }
    })
  }
}