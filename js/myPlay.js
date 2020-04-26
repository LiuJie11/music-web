(function(window){
    function Player($audio){
        return new Player.prototype.init($audio)
    }
    Player.prototype = {
        constructor:Player,
        init:function($audio){
            this.$audio = $audio // jq对象
            this.audio = $audio.get(0) // dom对象
            // console.log(this.$audio,this.audio)
        },
        musicList:[],
        cureentIndex:-1, //记录播放的是哪一首歌
        // 播放某一首音乐
        playMusic:function(index,music){
            // 判断是否同一首歌播放
            if(this.cureentIndex==index){
               // 同一首歌播放
                if(this.audio.paused){
                    this.audio.play()
                }else{
                    this.audio.pause()
                }
            }else{
                // 不同一首歌播放
                this.$audio.attr('src',music.link_url)
                this.audio.play()
                this.cureentIndex = index
            }
        },
        // 播放上一首
        preIndex:function(){
            var index = this.cureentIndex -1
            if(index<0){
                index = this.musicList.length-1
            }
            return index 
        },
        // 播放下一首
        nextIndex:function(){
            var index = this.cureentIndex+1
            if(index>this.musicList.length-1){
                index = 0
            }
            return index
        },
        // 删除某一首歌
        deleteMusic:function(index){
            this.musicList.splice(index, 1);
            if(index<this.cureentIndex){
                this.cureentIndex -=  1 
            }
        },
        // 监听播放的时间进度
        musicTimedate:function(callBack){
            let $this = this
            $this.$audio.on('timeupdate',function(){
                // 获取歌曲的总时间
                  var duration =  $this.audio.duration
                // 获取歌曲的播放时间
                  var currentTime = $this.audio.currentTime
                  var timeStr = $this.formatDate(duration,currentTime)
                  callBack(duration,currentTime,timeStr)
            })
        },
        // 播放时间和总时间处理
        formatDate:function(duration,currentTime){
            var endMin = parseInt(duration / 60) 
            var endSec = parseInt(duration % 60)
            if(endMin<10){
                endMin = '0' + endMin
            }
            if(endSec<10){
                endSec = '0' + endSec
            }
 
            var startMin = parseInt(currentTime / 60) 
            var startSec = parseInt(currentTime % 60)
 
            if(startMin<10){
                 startMin = '0' + startMin
             }
            if(startSec<10){
                 startSec = '0' + startSec
             }
 
             return startMin+":"+startSec+" / "+endMin+":"+endSec
        },
        // 控制音乐播放或者移动到指定位置
        musicSeekTo:function(value){
            if(isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value
        },
         // 控制播放声音
        musicVoiceSeekTo: function (value) {
            if(isNaN(value)) return;
            if(value <0 || value > 1) return;
            // 0~1
            this.audio.volume = value;
        }
      


    }
    Player.prototype.init.prototype = Player.prototype
    window.Player = Player
})(window)