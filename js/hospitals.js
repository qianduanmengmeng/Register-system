//	从远程获得数据（一般在后台处理）
//	condition = {type:'卫生部直属',level:'*',position:'*'}
var hospitalData = function(condition){

	var condition = condition || {type:'*',level:'*',position:'*'};

	var baseData = [
		{name:'首都儿科研究所附属儿童医院',type:'卫生部直属医院',level:'三级甲等',position:'朝阳区',address:'北京市朝阳区雅宝路2号',time:'14:30',phone:'010-85695756',img:'img/hospital-1.jpg'},
		{name:'中日友好医院',type:'卫生部直属医院',level:'三级甲等',position:'朝阳区',address:'北京市朝阳区樱花东路2号',time:'8:30',phone:'010-84205288',img:'img/hospital-2.jpg'},
		{name:'首都医科大学附属北京友谊医院',type:'卫生部直属医院',level:'三级甲等',position:'西城区',address:'北京市西城区永安路95号',time:'9:30',phone:'010-63016616',img:'img/hospital-3.jpg'},
		{name:'首都医科大学附属北京地坛医院',type:'卫生部直属医院',level:'三级甲等',position:'朝阳区',address:'北京市朝阳区樱花东路2号',time:'8:30',phone:'010-84205288',img:'img/hospital-4.jpg'},
		{name:'空军总医院',type:'北京区县属医院',level:'三级甲等',position:'朝阳区',address:'北京市朝阳区樱花东路2号',time:'8:30',phone:'010-84205288',img:'img/hospital-5.jpg'},
		{name:'航天中心医院(原721医院)',type:'北京区县属医院',level:'三级合格',position:'海淀区',address:'北京市海淀区玉泉路15号',time:'8:30',phone:'010-59971160',img:'img/hospital-6.jpg'},
		{name:'北京中医药大学东方医院',type:'北京区县属医院',level:'三级甲等',position:'丰台区',address:'北京丰台区方庄芳星园一区6号',time:'8:30',phone:'010-67689655',img:'img/hospital-1.jpg'},
		{name:'北京电力医院',type:'北京区县属医院',level:'三级合格',position:'丰台区',address:'北京市丰台区太平桥西里甲1号',time:'8:30',phone:'010-84205288',img:'img/hospital-2.jpg'},
		{name:'北京中医医院顺义医院',type:'北京区县属医院',level:'三级甲等',position:'顺义区',address:'北京市顺义区站前东街5号',time:'8:30',phone:'010-84205288',img:'img/hospital-3.jpg'},
		{name:'首都医科大学附属北京潞河医院三级综合医院',type:'其他',level:'三级甲等',position:'通州区',address:'北京市通州区新华南路82号',time:'8:30',phone:'010-69543901',img:'img/hospital-4.jpg'}
	];

	for(k in condition){
		var v = condition[k];
		for(i in baseData){
			if( v !='*' && baseData[i][k] != v ){
				delete  baseData[i];
			}
		}
	}

	var data = [];
	for(i=0;i<baseData.length;i++){
		if(baseData[i]){
			data.push(baseData[i]);
		}
	}
	return data;
};
hospitalData.allCondition = function(){
	var baseData = hospitalData({type:'*',level:'*',position:'*'});
	var condition = {
		'type':{},
		'level':{},
		'position':{}
	};
	//	去重处理
	for(var i=0,l=baseData.length;i<l;i++){
		condition['type'][baseData[i]['type']]=true;
		condition['level'][baseData[i]['level']]=true;
		condition['position'][baseData[i]['position']]=true;
	}
	return condition;
};


$(function () {



	//	更新数据列表
	$('#datalist').on('render',function( evt , data){
		data = data.data;
		var template  = $('#datalist_tmplate').html();

		$('#datalist').empty();

		if(data.length == 0){
			$('#datalist').html('<div class="item">没有符合条件的数据！</div>');
		}else{

			for( s in data){
				var html = template
				.replace('{name}',data[s]['name'])
				.replace('{level}',data[s]['level'])
				.replace('{time}',data[s]['time'])
				.replace('{phone}',data[s]['phone'])
				.replace('{address}',data[s]['address'])
				.replace('{img}',data[s]['img'])
				
				$('#datalist').append(html);
			}
		}

	});

	//	头部条件
	var condition = hospitalData.allCondition();
	$('#filter .group')
	.each(function(){
		var k =  $(this).attr('condition-name');
		for(s in condition[k]){
			$('<a class="condition" condition-val="'+s+'" href="#0"> '+s+' </a> ').appendTo(this);
		}
	})
	.delegate('a.condition','click',function(){
		$(this).parents('.group').eq(0).find('a.condition').removeClass('condition_focus');
		$(this).addClass('condition_focus');

		$('#pagination').triggerHandler('initData');
		$('#pagination').triggerHandler('renderListByPage');
	});
	
	//	更新分页
	$('#pagination')

		.on('initData',function(){

				var pageSize = 3;	  //	每页显示3个;
				var currentPage = 0;  //	当前在第 1 页;
				var countPage = 0;

				var condition = {};
				$('#filter .group a.condition_focus').each(function(){
					var k = $(this).parents('.group').eq(0).attr('condition-name');
					var v = $(this).attr('condition-val');
					condition[k] = v;
				});
				console.log(condition);

				//	所有数据
				var allData = hospitalData(condition);

				//	分页计算
				countPage = Math.ceil(allData.length/pageSize);

				//	更新分页html信息
				$('.page_wrap',this).empty();
				for(i=0;i<countPage;i++){
					$('.page_wrap',this).append('<a href="#0" class="item item_page">'+(i+1)+'</a>');
				}
				$('.item_count').text('共计'+countPage+'页');

				$(this)
					.data('pageSize',pageSize)
					.data('currentPage',0)
					.data('countPage',countPage)
					.data('allData',allData);

		})
		.on('renderListByPage',function(){
			var data = $(this).data();

			currentPage = data.currentPage;
			pageSize = data.pageSize;
			allData = data.allData;
			currentPageData = allData.slice(currentPage*pageSize, (currentPage+1)*pageSize );
			$('#datalist').triggerHandler('render',{data:currentPageData});

			$('.page_wrap a.item_page',this)
				.removeClass('item_page_focus')
				.eq(currentPage)
				.addClass('item_page_focus');

		})

		.on('initEvent',function(){
			//	初始化事件
			
			var pagination = $(this);
			var data = $(this).data();
			$('.item_first',this).on('click',function(){
					data.currentPage = 0;
					pagination.triggerHandler('renderListByPage');
					return false;
			});

			$('.item_last',this).on('click',function(){
				data.currentPage = data.countPage-1;
				pagination.triggerHandler('renderListByPage');
				return false;
			});
			$('.item_prev',this).on('click',function(){
				if(data.currentPage - 1 >= 0){
					data.currentPage -=1;
					pagination.triggerHandler('renderListByPage');
				}
				return false;
			});
			$('.item_next',this).on('click',function(){
				if(data.currentPage + 1 < data.countPage){
					data.currentPage +=1;
					pagination.triggerHandler('renderListByPage');
				}
				return false;
			});
			$('.page_wrap').delegate('.item_page','click',function(){
					data.currentPage = $(this).index();
					console.log(data.currentPage);
					pagination.triggerHandler('renderListByPage');
					return false;
			});


			$(this).triggerHandler('initData');
			$(this).triggerHandler('renderListByPage');

		})
		.triggerHandler('initEvent');

		

});