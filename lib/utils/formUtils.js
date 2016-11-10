var formUtils={
    /**
     * 把URL参数转化成字符串
     * @param {Array | Object} params
     * @returns {string}
     */
    param:function(params){
        var type=Object.prototype.toString.call(params);
        var a=[];
        if(type==='[object Array]'){
            params.forEach(function(o){
                a[a.length]=encodeURIComponent(o.name)+'='+encodeURIComponent(o.value);
            });
        }else if(type==='[object Object]'){
            for(var name in params){
                a[a.length]=encodeURIComponent(name)+'='+encodeURIComponent(params[name]);
            }
        }
        return a.join('&');
    },
    /**
     * 以字符串形式获取表单数据
     * @param {Selector | Element} form
     * @returns {String}
     */
    serialize:function(form){
        return this.param(this.serializeArray(form));
    },
    /**
     * 以数组形式获取表单数据
     * @param {Selector | Element} form
     * @returns {Array}
     */
    serializeArray:function(form){
        if(typeof form === 'string'){
            form=document.querySelector(form);
        }
        var fields=form.querySelectorAll('[name]');
        var arr=[];
        for(var i=0,len=fields.length,field;i<len;i++){
            field=fields[0];
            if(field.name){
                arr.push({
                    name:field.name,
                    value:field.value
                });
            }
        }
        return arr;
    },
    /**
     * 以对象形式获取表单数据
     * @param {Selector | Element} form
     * @returns {Object}
     */
    serializeObj:function(form){
        var arr=this.serializeArray(form);
        var obj={};
        arr.forEach(function(o){
            obj[o.name]=o.value;
        });
        return obj;
    }
};

module.exports=formUtils;