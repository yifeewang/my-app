
import React from 'react'
import {connect} from 'react-redux'
import { Row, Col, Input, AutoComplete, DatePicker,Table } from 'antd';
import moment from 'moment'
import { addCompony } from "./store/action"
import {AppProps, AppState} from './Apptypes'
import {listArray, StoreState} from './store/types/types'
import mockData from './mockData'
import   './App.scss'
import { log } from 'util';

const { RangePicker } = DatePicker;
const { Search } = Input;
const dateFormat = 'YYYY-MM-DD HH:mm'||undefined;
const columns = [
  {
    title: 'Compony',
    dataIndex: 'compony',
    key: 'compony',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Telephone',
    dataIndex: 'telephone',
    key: 'telephone',
  },
  {
    title: 'UserId',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: 'CardId',
    dataIndex: 'cardId',
    key: 'cardId',
  }
];

class App extends React.Component<AppProps,AppState>{
  constructor(props:any){
    super(props)
    this.state = {
      startTime:undefined,//开始时间
      endTime:undefined,  //结束时间
      options: [],  //模糊匹配显示
      selectOptions: [], //模糊匹配存入
      timeOptions:[],
      accurateOptions: [] //条件匹配存入
    }
  }

  componentDidMount(){
    //进行ajax请求，获取初始数据 存入redux
    // const {addCompony} = this.props 
    // fetch('/add').then((res) => {
    //   addCompony(res.data)
    // })
    this.props.addCompony(mockData)
  }

  onSelect = (value:string) => {
    this.setState({
      selectOptions: this.props.list.filter(item => item.compony.indexOf(value)!==-1)
    })
  }

  searchResult = (query:string) => {
    const {list} = this.props
    return list.filter(item => {
      return item.compony.indexOf(query)!==-1
    }).map((item, idx) => {
        return {
          value: item.compony,
          label: (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {item.compony}
            </div>
          ),
        };
      });
  }

  handleSearch = (value:string) => {
    this.setState({
      options: value ? this.searchResult(value) : [],
      selectOptions: this.props.list.filter(item => item.compony.indexOf(value) !== -1)
    })
  }

  handlePressEnter = (e:any) => {
    this.handleAccurateSearch(e.target.value)
  }

  findIdAndTel = (item:any,value:string) => {
    let flag = false
    for(var prop in item){
        if(item.hasOwnProperty(prop)){
          if( item[prop].indexOf(value) !== -1){
            flag = true 
            break
          }
        }
    }
    return flag
  }

  handleAccurateSearch = (value:string) => {
    this.setState({
      accurateOptions: this.props.list.filter(item => {
          return this.findIdAndTel(item,value)
      })
    })
  }

  handleAccurateChange = (e:any) => {
    this.setState({
      accurateOptions: this.props.list.filter(item => {
          return this.findIdAndTel(item,e.target.value)
      })
    })
  }

  onPickerChange = (date: any, dateString: any) => {
    const {list} = this.props
    //这两个参数值antd自带的参数
    console.log("dateString",dateString[0],"dateString",dateString[1]);
    this.setState({
      startTime:dateString[0],
      endTime:dateString[1],  
      timeOptions: list.filter(item => {
          const componyTime = new Date(item.time).getTime()
          const startDate = new Date(dateString[0]).getTime()
          const endDate = new Date(dateString[1]).getTime()
          return componyTime < endDate && componyTime > startDate
      })
    })
  }

  disabledDate = (current: any) => {
      // 只能选择今天和今天之前的时间
		return current && current > moment().endOf('day');
  }

  render() {
    const {list} = this.props
    const {options, selectOptions, accurateOptions, timeOptions} = this.state
    return (
      <div style={{padding:'30px 30px'}}>
          <Row>
            <Col span={2}>
                选择商家:
            </Col>
            <Col span={8} className='topLeft'>
            <AutoComplete
              dropdownMatchSelectWidth={500}
              style={{ width: 500 }}
              options={options}
              onSelect={this.onSelect}
              onSearch={this.handleSearch}
            >
              <Input.Search size="middle" placeholder="请输入要搜索的商家名" enterButton onSearch={this.onSelect}/>
            </AutoComplete>
            </Col>
            <Col span={2} offset={2}>
                选择日期:
            </Col>
            <Col span={8} >
                <RangePicker 
                    onChange={this.onPickerChange} 
                    disabledDate={this.disabledDate}
                    value={this.state.startTime===undefined||this.state.endTime===undefined||this.state.startTime===""||this.state.endTime===""?null:[moment(this.state.startTime, dateFormat), moment(this.state.endTime, dateFormat)]}
                    format={dateFormat}
                    placeholder={['开始时间','结束时间']}
                />
            </Col>
          </Row>
          <Row style={{margin:'20px 0'}}>
              <Col span={2}>
                  条件搜索:
              </Col>
              <Col span={8} className='bottomLeft'>
              <Search 
                placeholder='请输入订单编号，用户id或者手机号码'
                onPressEnter={this.handlePressEnter}
                onSearch={this.handleAccurateSearch}
                onChange={this.handleAccurateChange}
                enterButton 
              />
              </Col>
          </Row>
          {
            list.length>0 ? 
              <Table 
                  columns={columns} 
                  dataSource={
                    accurateOptions.length>0 
                      ? accurateOptions 
                      : timeOptions.length>0
                        ? timeOptions
                        : selectOptions.length>0 
                          ? selectOptions 
                          : list} />
            : null
          }
      </div>
    )
  }
}
 
const mapStateToProps = ( state: StoreState) =>{
  return {
      list: state.list
  }
}

const mapActionsToProps = ( dispatch: any )=>{
  return {
    addCompony: ( data: Array<listArray> )=>{
          dispatch( addCompony( data ) )
      }
  }
}

export default connect( mapStateToProps, mapActionsToProps )( App )