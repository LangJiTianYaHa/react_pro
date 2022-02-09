import React, { Component } from 'react'
import {Icon,List,Card} from 'antd'
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'
const Item = List.Item

export default class ProductDetail extends Component {


  state = {
    cName1 :"", //一级分类名称
    cName2 : "", //二级分类名称
  }

  async componentDidMount(){
    //得到当前商品的分类ID
    // const  {pCategoryId,categoryId} = this.props.location.state.product
    const  {pCategoryId,categoryId} = memoryUtils.product
    //一级分类下的商品
    if(pCategoryId === '0'){
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      //修改状态
      this.setState({cName1})
    }else{
    //二级分类下的商品
    /* 
    const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
    const cName1 = results[0].data.name
    const cName2 = results[1].data.name
    */
   const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
   const cName1 = results[0].data.name
   const cName2 = results[1].data.name
    
    /* const result1 = await reqCategory(pCategoryId)
    const result2 = await reqCategory(categoryId)
    const cName1 = result1.data.name
    const cName2 = result2.data.name */
    this.setState({
      cName1,
      cName2
    })    
  }
  }

   /* 
 在 卸载之前清除保存的数据
 */
componentWillUnmount () {
  memoryUtils.product = {}
}

  render() {

    //读取携带过来的state数据
    // const {name,desc,price,detail,imgs} =  this.props.location.state.product
    const {name,desc,price,detail,imgs} =  memoryUtils.product
    const {cName1,cName2} = this.state


    const title = (
      <span>
        <LinkButton>
          <Icon 
            onClick={() => this.props.history.goBack()}
            type='arrow-left' 
            style={{fontSize:20,marginRight:10}}/>
        </LinkButton>
        <span>商品详情</span>
      </span>
    )

    return (
      
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='left'>商品名称：</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述：</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格：</span>
            <span>{price}</span>
          </Item>
          <Item>
            <span className='left'>所属分类：</span>
            {/* <span>{cName1}{cName2 ?  ' --> '+cName1 : "" }</span> */}
            <span>{cName1} {cName2 ? ' --> '+cName2 : ''}</span>
          </Item>
          <Item>
            <span className='left'>商品图片：</span>
            <span>
              {
                imgs.map(img =>(
                  <img 
                    key={img}
                    className="product-img"
                    src={BASE_IMG_URL + img}
                    alt="img"
                  />  
                ))
              }
              
                
            </span>
          </Item>
          <Item>
            <span className='left'>商品详情：</span>
            <span dangerouslySetInnerHTML={{__html:detail}}></span>
          </Item>
          <Item></Item>
        </List>
      </Card>
    )
  }
}
