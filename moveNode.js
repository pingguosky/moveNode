(function($, undefined) {
    var pluginName = 'MoveNode';
    var member = {};       // 初始化( 用来装被移入的节点 )
    // 初始化
    function MoveNode(ele, opt) {
        this.a = ele;
        this.$element = $(ele);             // jQuery对象
        this.defaults = {
            'obj': '',                      // 必须，被添加的节点
            'toTarget': '',                // 必须，要添加到的节点
            'nodeVary': true,
            'afterAdd': ''
        };
        this.options = $.extend({}, this.defaults, opt);        // 参数
        // 调用其方法
        this.init();
    }

    // 定义MoveNode的方法
    MoveNode.prototype = {

        init: function() {
            var self = this;
            // 如果是未来节点
            if (self.options.afterAdd !== '') {
                $(document).off('click.clickafter', self.options.afterAdd).on('click.clickafter', self.options.afterAdd, function(e) {
                    self._nodeHandle.call(this, self);
                })
            }

            // 鼠标弹起
            this.$element.off('click.clickdir').on('click.clickdir', function() {
                self._nodeHandle.call(this, self);
            });
        },

        _nodeHandle: function(_this) {
            var self = _this,
                obj = self.options.obj,
                flagHas = obj === 'this',
                node = flagHas ? $(this) : $(obj),
                nodeLen = node.length,
                fragment = document.createDocumentFragment();   // 创建文档碎片

            var nodeTarget = self.options.toTarget;
            // 判断是添加到某区域还是删除节点
            if (self.options.nodeVary === 'false') {
                if (flagHas) {
                    // 删除某节点
                    memberId = node.data('id');
                    node.closest('li').remove();
                    member[memberId] = "";
                } else {
                    // 删除所有节点
                    node.remove();
                    for (var o in member) {
                        member[o] = "";
                    }
                }

            } else {
                for (var i = 0; i < nodeLen; i++) {
                    var memberId = $(node[i]).data('id'),       // 获取节点数据dataId
                        memberName = node[i].innerHTML;    // 获取点击节点的值
                    if (member[memberId] === undefined || member[memberId] === '') {
                        var selectName = '<li><a class="member-name"><span>' +  memberName + '</span><div class="member-del" data-id=' + memberId + '>×</div></a></li>';
                        $(selectName).appendTo(fragment);
                        member[memberId] = memberName;
                    }
                }
                $(fragment).appendTo(nodeTarget);
            }
        }
    };

    $.fn[pluginName] = function(options) {
        //this.each(function() {
            // each中的this指向DOM原生对象
            if (!$(this).data('plugin_' + pluginName)) {
                $(this).data('plugin_' + pluginName, new MoveNode(this, options));
            }
        //});
    }
})(jQuery);