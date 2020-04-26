$(function(){
    // 初始化滚动条
    $(".content_list").mCustomScrollbar();

    // 获取audio jq对象
    var $audio = $('audio')
    // 创建 播放实例对象
    var player = new Player($audio);
    var lyric
    var progress
    var voiceProgress
    

    // 1请求数据
    getData()
    function getData(){
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function (data) {
                let $palyList =  $('.content_list ul')
                player.musicList = data
                $.each(data,function(index,item){
                    let str = createPlayItem(index,item)
                    $palyList.append(str)
                    
                })
                initMusicInfo(data[0])
                initMusicLyric(data[0])
            },
            error: function (e) {
                console.log(e);
            }
        });
    }
    // 2 创建需要渲染的li
    function createPlayItem(index,item){
        let $item = $(`<li class="list_music">
            <div class="list_check"><i></i></div>
            <div class="list_number">${index+1}</div>
            <div class="list_name">${item.name}
                    <div class="list_menu">
                        <a href="javascript:;" title="播放" class='list_menu_play'></a>
                        <a href="javascript:;" title="添加"></a>
                        <a href="javascript:;" title="下载"></a>
                        <a href="javascript:;" title="分享"></a>
                    </div>
            </div>
            <div class="list_singer">${item.singer}</div>
            <div class="list_time">
                    <span>${item.time}</span>
                    <a href="javascript:;" title="删除" class='list_menu_del'></a>
            </div>
        </li>`)

        $item.get(0).index = index
        $item.get(0).item = item
        return $item
    }

    // 3 初始化歌曲信息
    function initMusicInfo(music){
        // 获取对应的元素
        var $musicImage = $(".song_info_pic images");
        var $musicName = $(".song_info_name a");
        var $musicSinger = $(".song_info_singer a");
        var $musicAblum = $(".song_info_ablum a");
        var $musicProgressName = $(".music_progress_name");
        var $musicProgressTime = $(".music_progress_time");
        var $musicBg = $(".mask_bg");

        // 给获取到的元素赋值
        $musicImage.attr("src", music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProgressName.text(music.name +" / "+ music.singer);
        $musicProgressTime.text("00:00 / "+ music.time);
        $musicBg.css("background", "url('"+music.cover+"')");
    }

     // 4.初始化歌词信息
    function initMusicLyric(music){
        lyric = new Lyric(music.link_lrc);
        var $lryicContainer = $(".song_lyric");
        // 清空上一首音乐的歌词
        $lryicContainer.html("");
        lyric.loadLyric(function () {
            // 创建歌词列表
            $.each(lyric.lyrics, function (index, ele) {
                var $item = $("<li>"+ele+"</li>");
                $lryicContainer.append($item);
            });
        });
    }

    // 5 进度条初始化
    initProgress()
    function initProgress(){
        // 获取滚动条 点  和滚动到哪 jq对象
        var $progressBar = $('.music_progress_bar')
        var $progressLine = $('.music_progress_line')
        var $progressDot = $('.music_progress_dot')
        // 创建滚动条实例对象 控制时间滚动条
        progress = new Progress($progressBar,$progressLine,$progressDot)
        // 进度条点击
        progress.progressClick(function(value){
            player.musicSeekTo(value)
        })
        // 进度条移动
        progress.progressMove(function(value){
            player.musicSeekTo(value)
        })
        //  控制声音滚动条
        var $voiceBar = $(".music_voice_bar")
        var $voiceLine = $(".music_voice_line")
        var $voiceDot = $(".music_voice_dot")
        voiceProgress = Progress($voiceBar,$voiceLine,$voiceDot)
        voiceProgress.progressClick(function (value) {
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressMove(function (value) {
            player.musicVoiceSeekTo(value);
        });
    }
  

    // 6 监听事件的触发
    initEvents()
    function initEvents(){
        // 1.1 监听li移入移出事件 利用事件委托
        $(document).on('mouseenter','.list_music',function(){
            $(this).find('.list_menu').stop().fadeIn(100)
            $(this).find('.list_time>span').stop().fadeOut(100)
            $(this).find('.list_time>a').stop().fadeIn(100)
        })
        $(document).on('mouseleave','.list_music',function(){
            $(this).find('.list_menu').stop().fadeOut(100)
            $(this).find('.list_time>span').stop().fadeIn(100)
            $(this).find('.list_time>a').stop().fadeOut(100)
        })
        // 1.2 监听li下面是否勾选
        $(document).on('click','.list_music>.list_check',function(){
            $(this).toggleClass('list_checked')
        })
        // 1.3 监听删除按钮
        $(document).on('click','.list_music .list_menu_del',function(){
            // 找到要删除的元素
            let $item = $(this).parents('.list_music') 
            // 判断删除的是否是正播放的音乐
            if($item.get(0).index == player.cureentIndex){
                // 如果播放的是正在播放的音乐就自动播放下一首歌
                $('.music_next').trigger('click')
            }
            // 删除对应的li
            $item.remove()
            // 删除对应的数据
            player.deleteMusic($item.get(0).index)
            // 重新排序
            $('.list_music').each(function(index,ele){
                ele.index = index
                $(ele).find(".list_number").text(index+1)
            })
        })
        // 1.4 监听列表的播放按钮
        $(document).on('click','.list_music .list_menu_play',function(){
            let $item = $(this).parents('.list_music')

            // 点击改变播放按钮状态
            $(this).toggleClass('list_menu_play2') 

            // 去重其它播放按钮状态
            $item.siblings().find('.list_menu_play').removeClass('list_menu_play2')

            // 列表播放按钮同步底部播放按钮
            if($(this).hasClass('list_menu_play2')){
                $('.footer .music_play').addClass('music_play2')
                $item.find('div').css('color','#fff')
                $item.siblings().find('div').css('color','rgba(255,255,255,0.5)')
            }else{
                $('.footer .music_play').removeClass('music_play2')
                $item.find('div').css('color','rgba(255,255,255,0.5)')
            }

            // 改变序号的状态
            $item.find('.list_number').toggleClass('list_number2')
            $item.siblings().find('.list_number').removeClass('list_number2')
            
            // 调用封装的播放类
            player.playMusic($item.get(0).index,$item.get(0).item)

            // 切换歌曲信息
            initMusicInfo($item.get(0).item)

            // 切换歌词信息
            initMusicLyric($item.get(0).item);
        })
        // 1.5监听底部播放按钮
       $('.music_play').click(function(){
           // 判断是否播放过歌曲
           if(player.cureentIndex==-1){
               // 没有播放过歌曲
               $('.list_music').eq(0).find('.list_menu_play').trigger('click')
           }else{
               // 播放过歌曲
               $('.list_music').eq(player.cureentIndex).find('.list_menu_play').trigger('click')
           }
       })
        // 1.6监听底部上首按钮
        $('.music_pre').click(function(){
            $('.list_music').eq(player.preIndex()).find('.list_menu_play').trigger('click')
        })

        // 1.7监听底部下一首按钮
        $('.music_next').click(function(){
            $('.list_music').eq(player.nextIndex()).find('.list_menu_play').trigger('click')
        })

        // 1.8监听喜欢按钮
        $(document).on('click','.footer .music_fav',function(){
           $(this).toggleClass('music_fav2')
        })

        // 1.9 监听播放进度
       player.musicTimedate(function(duration,currentTime,timeStr){
            // 同步时间
            $(".music_progress_time").text(timeStr);
            // 同步进度条百分比
            var value = currentTime / duration *100
            progress.setProgress(value)
            // 实现歌词同步
            var index = lyric.currentIndex(currentTime);
            var $item = $(".song_lyric li").eq(index);
            $item.addClass("cur");
            $item.siblings().removeClass("cur");

            // 实现歌词滚动
            if(index <= 2) return;
            $(".song_lyric").css({
                marginTop: (-index + 2) * 30
            });
       })

        // 1.10 监听声音按钮的点击
        $(".music_voice_icon").click(function () {
            // 图标切换
            $(this).toggleClass("music_voice_icon2");
            // 声音切换
            if($(this).hasClass("music_voice_icon2")){
                // 变为没有声音
                player.musicVoiceSeekTo(0);
            }else{
                // 变为有声音
                player.musicVoiceSeekTo(1);
            }
        });
       
    }  
    
  
})