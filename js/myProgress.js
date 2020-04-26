(function(window){
    function Progress($progressBar,$progressLine,$progressDot){
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot)
    }
    Progress.prototype ={
        constructor:Progress,
        init:function($progressBar,$progressLine,$progressDot){
            this.$progressBar = $progressBar
            this.$progressBLine = $progressLine
            this.$progressDot = $progressDot
            isMove:false
        },
        // this.$progressBar 点击事件封装
        progressClick:function(callBack){
            let $this = this // 保存this
              // 获取this.$progressBar距离左边窗口的距离
            let barLeft = this.$progressBar.offset().left
             // 获取this.$progressBar的宽度
            let barWidth = this.$progressBar.width()
            let eLeft
            this.$progressBar.click(function(envent){
                // 获取点击位置距离左边窗口的距离
                 eLeft  = envent.pageX
                // 限制可滚动的区域
                let offset = eLeft - barLeft
               if(offset>=0&&offset<=barWidth){
                    // 设置 this.$progressBLine的宽度
                    $this.$progressBLine.css('width', offset)
                    // 设置 this.$progressDot移动的距离
                    $this.$progressDot.css('left',offset)
               }
                // 计算进度条的比例
               var value = offset / barWidth
               callBack(value)
            })
        },
        // this.$progressBar 移动功能封装
        progressMove:function(callBack){
            let $this =this
             // 获取this.$progressBar距离左边窗口的距离
            let barLeft = this.$progressBar.offset().left
             // 获取this.$progressBar的宽度
            let barWidth = this.$progressBar.width()
            let eLeft
            let offset
            this.$progressBar.mousedown(function(){
                $this.isMove = true
                $(document).mousemove(function(envent){
                    // 获取移动位置距离左边窗口的距离
                     eLeft  = envent.pageX
                      // 限制可滚动的区域
                     offset = eLeft - barLeft
                    if(offset>=0&&offset<=barWidth){
                        // 设置 this.$progressBLine的宽度
                        $this.$progressBLine.css('width', offset)
                        // 设置 this.$progressDot移动的距离
                        $this.$progressDot.css('left',offset)
                    }
                   
                })
            })
            // 当鼠标抬起的时候  
            $(document).mouseup(function(){
                $(document).off('mousemove')
                $this.isMove = false
                 // 计算进度条的比例
               var value = offset / barWidth
               callBack(value)
            })
        },

        // 设置播放时的进度条
        setProgress:function(value){
            if(this.isMove) return
            if(value<0 || value>100) return
            this.$progressBLine.css({
                width: value +'%'
            })
            this.$progressDot.css({
                left: value + '%'
            })
        },

       

    }
    Progress.prototype.init.prototype = Progress.prototype
    window.Progress = Progress
})(window)