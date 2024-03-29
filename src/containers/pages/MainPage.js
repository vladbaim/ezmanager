import MainPage from 'components/pages/MainPage'
import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actionsWorkData  from 'actions/workdata';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import download from "downloadjs";

import imgTobase64 from 'helpers/pngToBase64';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


class WorkDataContainer extends React.Component {

	render() {
		const { workdata, dayscount } = this.props;
		if (!workdata){
			const { fetchWorkData } = this.props;
			fetchWorkData(dayscount);
		}
		return <MainPage {...this.props} setDishReady={setDishReady.bind(this)} showHideTechMap={showHideTechMap.bind(this)} generateMenu={generateMenu.bind(this)} generatePDF={generatePDF.bind(this)} refreshData={refreshData.bind(this)} setDaysCount={setDaysCount.bind(this)} setCheckBox = {setCheckBox.bind(this)} />
	}

}

function setCheckBox(product) {
         const { setBuyListChecked } = this.props;
         setBuyListChecked(product);
         this.setState({});
}

function setDishReady(dish) {
         const { setDishReady } = this.props;
         setDishReady(dish);
         this.setState({});
}

function showHideTechMap(dish) {
         const { showHideTechMap } = this.props;
         showHideTechMap(dish);
         this.setState({});
}

function setDaysCount(count) {
         const { SetDaysCount } = this.props;
         SetDaysCount(count);
}

function refreshData() {
        const { fetchWorkData, dayscount } = this.props;
        fetchWorkData(dayscount);
}

const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентебря', 'Октября', 'Ноября', 'Декабря'];

function generateMenu () {
	const { workdata } = this.props;
	imgTobase64('logo.png')
	  .then(logo => {
	  		imgTobase64('background.png')
	  			.then(background => {
		  	var tomDay = 7
		  	var Days = workdata.DaysInfo.days
		  	console.log(Days)
			var docDefinition = {
				pageSize: 'A4',
				background: [
				   {
				       image: background,
				       width: 600
				   }],
				pageMargins: [ 40, 40, 40, 40 ],
				content: [],
				footer: [{text: 'Мы всегда рады обратной связи, расскажите нам о ваших пожеланиях и впечатлениях, мы обязательно прислушаемся к вам.', style: 'footertext'}],
			  	styles: {
					header: {
						fontSize: 34,
						bold: true,
						alignment: 'center',
						margin: [0, 35, 0, 40],
					},
					menuItem: {
						fontSize: 30,
						bold: true,
						alignment: 'center',
						margin: [0, 20, 0, 0],
					},
					footertext: {
						fontSize: 8,
						italics: true,
						alignment: 'center'
					}
				}
			};

			for (var i = 0; i<7; i++) {
				var data = new Date(Days[tomDay].date)
				var MenuHeader = [
					{image: logo, margin: [0, 0, 0, 0], width: 80, alignment: 'center'},
					{
						text: ('Меню на ' + data.getDate() + ' ' + months[data.getMonth()]),
				 		style: 'header'
					}]
				docDefinition.content.push(MenuHeader)

				var list = {
					type: 'none',
					style: 'header',
					ul: []
				}
				for (var meal of Days[tomDay].day.meals) {
					var TextList = ''
					for (var dishs of meal.meal.find(x => x.main === true).dishs) {
						((meal.meal.find(x => x.main === true).dishs.indexOf(dishs) !== 0 )
							? TextList += dishs.dish.title.toLowerCase()
							: TextList += dishs.dish.title)

						if (meal.meal.find(x => x.main === true).dishs.length !== meal.meal.find(x => x.main === true).dishs.indexOf(dishs) + 1)
							TextList += ', '
					}
					var listItem = { text: TextList, style: 'menuItem' }
					docDefinition.content.push(listItem)
				}

				tomDay++;
				docDefinition.content.push(list)
				var pageBreak = {
					text: '',
				 	pageBreak: 'after'
				}
				if (i !== 6)
					docDefinition.content.push(pageBreak)
			}
			pdfMake.createPdf(docDefinition).open();
		})
	})
}

function generatePDF() {
	const { workdata } = this.props;
	var docDefinition = {
		pageSize: 'A5',
		pageMargins: [ 40, 40, 40, 40 ],
		content: [],
		footer: [{ 
			 		text: 'Мы всегда рады обратной связи, расскажите нам о ваших пожеланиях и впечатлениях, мы обязательно прислушаемся к вам.', 
			 		style: 'footertext'
			 	}],
		defaultStyle: {
	    	fontSize: 8
	  	},
	  	styles: {
			header: {
				fontSize: 14,
				bold: true,
				alignment: 'right',
				width: 150,
				margin: [0, 5, 0, 0],
			},
			subheader: {
				fontSize: 12,
				bold: true,
				margin: [0, 10, 0, 0],
			},
			menuheader: {
				fontSize: 14,
				bold: true,
				alignment: 'center',
				margin: [0, 10, 0, 0],
			},
			tableheader: {
				fontSize: 8,
				bold: true
			},
			footertext: {
				fontSize: 8,
				italics: true,
				alignment: 'center'
			},
			payinfo: {
				fontSize: 8,
				alignment: 'right'
			}
		}
	};

	imgTobase64('logo.png')
	  .then(dataUrl => {
	    var logo = dataUrl;
	    for (var order of workdata.Orders) {
	    	var data = new Date( order.date.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
		 	var content = [
			 	{ 
			 		columns: [
				 		{image: logo, width: 50},
				 		{text: 'Здравствуйте, ' + order.name + '!\n Это ваше меню на ' + data.getDate() + ' ' + months[data.getMonth()], style: 'header'}
			 		]
			 	},
			 	{ 
			 		text: 'Ваша программа: ' +  order.program.title + " " +  order.option, 
			 		style: 'subheader'
			 	},
		 		{
					table: {
						headerRows: 1,
						widths: ['*'],
						body: [
							[{text: ''}],
							['']
						]
					},
					layout: 'headerLineOnly'
				},
				{ 
			 		text: 'МЕНЮ', 
			 		style: 'menuheader'
			 	}
		 	]
		 	var dishsTab = {
				table: {
					headerRows: 1,
					widths: [35, '*', 30, 30, 24, 24, 24],
					body: [
						[{text: 'Прием пищи', style: 'tableheader'}, {text: 'Блюдо', style: 'tableheader'}, {text: 'Порция', style: 'tableheader'}, {text: 'Ккал', style: 'tableheader'}, {text: 'Белки', style: 'tableheader'}, {text: 'Жиры', style: 'tableheader'}, {text: 'Углев.', style: 'tableheader'}]
					]
				},
					margin: [0, 10, 0, 0],
					layout: 'lightHorizontalLines'
			}
			for (var meal of order.program.options.find(o => o.cal === order.option).days.find(o => o.title === order.day.title).meals) {
				var mealRow = []
				var countDishs = 0;
				for (var dishs of meal.meal){
					for (var dish of dishs.dishs)
						countDishs++;
				}
				var mealCol = [{rowSpan: countDishs, text: meal.title}]
				mealRow = mealCol
				for (var dishs of meal.meal){
					for (var dish of dishs.dishs) {
						mealRow.push(
							dish.dish.title, 
							{ alignment:'right', text: (dish.gram.toFixed(0) + " Гр")}, 
							{ alignment:'right', text: (dish.cal.toFixed(0)+ " К")}, 
							{ alignment:'right', text: (dish.prot.toFixed(0)+ " Б")}, 
							{ alignment:'right', text: (dish.fat.toFixed(0)+ " Ж")}, 
							{ alignment:'right', text: (dish.carb.toFixed(0)+ " У")})
						dishsTab.table.body.push(mealRow)
						mealRow = ['']
					}
				}
			}
			var sumRow = [
				{colSpan: 3, text: 'Итого:', alignment: 'right', bold: true}, 
				'',
				'',
				{ alignment:'right', text: (order.program.options.find(o => o.cal === order.option).days.find(o => o.title === order.day.title).meals.reduce((cal, meal) => cal + meal.cal, 0).toFixed(0) + " К")},
				{ alignment:'right', text: (order.program.options.find(o => o.cal === order.option).days.find(o => o.title === order.day.title).meals.reduce((prot, meal) => prot + meal.prot, 0).toFixed(0) + " Б")},
				{ alignment:'right', text: (order.program.options.find(o => o.cal === order.option).days.find(o => o.title === order.day.title).meals.reduce((fat, meal) => fat + meal.fat, 0).toFixed(0) + " Ж")},
				{ alignment:'right', text: (order.program.options.find(o => o.cal === order.option).days.find(o => o.title === order.day.title).meals.reduce((carb, meal) => carb + meal.carb, 0).toFixed(0) + " У")}
			]
			dishsTab.table.body.push(sumRow)
			content.push(dishsTab)
			var payInfo = [
				{ 
			 		text: 'Приятного аппетита!', 
			 		style: 'menuheader'
			 	},
			 	{
			 		text: ('Ваш заказ на ' + order.count + ((order.count>4)? ' Дней' : ' Дня')),
			 		style: 'payinfo',
			 		margin: [0, 10, 0, 0],
			 	},
			 	{
			 		text: ('Цена дня' +   ((order.orderData.totalsale) ? (' (с учетом скидки ' + order.orderData.totalsale + '%): ') : ': ') + ((order.orderData.totalprice/order.count).toFixed(0)) + ' Руб'),
			 		style: 'payinfo'
			 	},
			 	{
			 		text: ('К оплате' +   ((order.orderData.totalsale) ? (' (с учетом скидки ' + order.orderData.totalsale + '%): ') : ': ') + order.orderData.totalprice.toFixed(0) + ' Руб'),
			 		style: 'payinfo'
			 	},
			 	{
			 		text: ('Статус заказа: ' + order.orderData.status),
			 		style: 'payinfo'
			 	},
			 	{
			 		text: ((order.orderData.status !== 'Оплачен') ? ('Бонусов будет начисленно: ' +  + (order.orderData.totalprice * 0.1).toFixed(0)) : ('Бонусов начисленно: ' + (order.orderData.totalprice * 0.1).toFixed(0))),
			 		style: 'payinfo'
			 	},
			 	{
			 		text: ((order.orderData.bonuses !== 0) ? ('Бонусов использовано: ' + order.orderData.bonuses) : ''),
			 		style: 'payinfo'
			 	},
			]
			content.push(payInfo)
			var pageBreak = {
				text: '',
			 	pageBreak: 'after'
			}
			if (workdata.Orders.length !== workdata.Orders.indexOf(order) + 1)
			content.push(pageBreak)

		 	docDefinition.content.push(content)
		}
		pdfMake.createPdf(docDefinition).open();
	})

}	

const mapStateToProps = ({ workdata }) => ({
  	workdata: workdata.data,
  	dayscount: workdata.dayscount
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(actionsWorkData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkDataContainer);