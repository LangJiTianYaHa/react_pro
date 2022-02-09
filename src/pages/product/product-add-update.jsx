import React, {  PureComponent } from 'react'
import {
  Card,
  Form,
  Icon,
  Input,
  Button,
  Cascader,
  message,

} from 'antd'

import RichTextEditor from './rich-text-editor'
import PicturesWall from './pictures-wall'
import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api'
import memoryUtils from '../../utils/memoryUtils'


const {Item} = Form
const {TextArea} = Input


class ProductAddUpdate extends PureComponent {


  state = {
    options:[]
  }

  constructor(props) {
    super(props)
    this.pw = React.createRef()
    this.editor = React.createRef()

  }
    /* 
  异步获取一级/二级列表显示
  */
  getCategorys = async (parentId)=>{
    const result = await  reqCategorys(parentId) //{status data}
    if(result.status === 0){
      const categorys  = result.data
      //如果是一级分类列表
      if(parentId === '0'){
      this.initOptions(categorys)
      }else{ //二级列表  当前async函数返回的promise就会成功且value为categorys
        return categorys
      }
    }
  }
  initOptions = async (categorys)=>{
    //根据categorys生产options数组 
    const  options = categorys.map(c =>({
      value: c._id,
      label: c.name,
      isLeaf: false, //不是叶子
    }))

    //如果是一个二级分类商品的更新
    const {isUpdate,product} = this
    const {pCategoryId} = product
    if(isUpdate && pCategoryId !== '0'){
      //生成对应得二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      const childOptions = subCategorys.map(c =>({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      //找到当前商品对应得一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)
      //关联到对应得一级option上
      targetOption.children = childOptions
    }
    //更新options状态
    this.setState({
      options:options
    })
  }



 /* 
 用于加载下一级列表的回调函数
 */
  loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[selectedOptions.length - 1];
    //显示loading
    targetOption.loading = true;

    //根据选中的分类 请求二级分类列表
    const subCategory = await this.getCategorys(targetOption.value)
    //隐藏loading
    targetOption.loading = false;

    if(subCategory && subCategory.length>0){
      const childOptions =  subCategory.map(c =>({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      //关联到当前options上
      targetOption.children = childOptions
    }else{  //当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }

    //更新options状态
    this.setState({
      options: [...this.state.options],
      // options: this.state.options,
    })
  }


  /*
    对商品价格进行自定义验证
  */
 validatePrice = (rule, value, callback)=>{
   value = value * 1
   if(value > 0){
     callback()
   }else{
     callback('价格是必须大于0的数值')
   }
 }


 /* 
 提交
 */
 submit = ()=>{
      //进行表单验证 通过了才发送请求
  this.props.form.validateFields( async (err,values)=>{
    if(!err){
      //1.收集数据 并封装成product对象
      const imgs = this.pw.current.getImgs()
      const detail = this.editor.current.getDetail()
      const {name,desc,price,categoryIds} =  values
      let pCategoryId,categoryId
      if(categoryIds.length === 1){
        pCategoryId = '0'
        categoryId = categoryIds[0]
      }else{
        pCategoryId = categoryIds[0]
        categoryId = categoryIds[1]
      }
      const product = {name,desc,price,pCategoryId,categoryId,imgs,detail}
      //如果是更新 添加_id
      if(this.isUpdate){
        product._id = this.product._id
      }
      //2.调用接口请求函数去添加/更新
      const result = await reqAddOrUpdateProduct(product)  

      //3.根据页面结果显示
      if(result.status === 0){
        message.success(`${this.isUpdate ? '更新' : '修改'}商品成功`)
        this.props.history.goBack()
      }else{
        message.error(`${this.isUpdate ? '更新' : '修改'}商品失败`)
      }

      /* //1.收集数据 并封装成product对象
      const {name,desc,price,categoryIds} = values
      const imgs = this.pw.current.getImgs()
      const detail = this.editor.current.getDetail()
      let pCategoryId,categoryId
      if(categoryIds.length === 1){
        pCategoryId = '0'
        categoryId =   categoryIds[0]
      }else{
        pCategoryId = categoryIds[0]
        categoryId =   categoryIds[1]
      }
      const product = {name,desc,price,pCategoryId,categoryId,imgs,detail}
      //如果是更新 添加_id
      if(this.isUpdate){
        product._id = this.product._id
      }
      //2.调用接口请求函数去添加/更新
      const result = await reqAddOrUpdateProduct(product)
      //3.根据页面结果显示
      if(result.status === 0){
        message.success(`${this.isUpdate ? "更新": "添加"}商品成功`)
        this.props.history.goBack()
      }else{
        message.error(`${this.isUpdate ? "更新": "添加"}商品失败`)
      }
       */

      
      console.log('submit()提交的数据 ',values+'values.desc',values.desc+'values.name',values.name+'values.price',values.price+'values.categoryIds',values.categoryIds+'imgs',imgs+'detail',detail)


    }
    
  })
 }

 componentDidMount(){
   this.getCategorys('0')
 }

 UNSAFE_componentWillMount (){
   //取出携带的state
  //  const product = this.props.location.state  //如果是添加没值 否则有值
   const product = memoryUtils.product  //如果是添加没值 否则有值
   // 保存是否是更新的标识
   this.isUpdate = !! product._id
   //保存商品（如果没有 保存的是{}）
   this.product = product || {}

 }

 /* 
 在 卸载之前清除保存的数据
 */
componentWillUnmount () {
  memoryUtils.product = {}
}


  render() {

    const {isUpdate,product} = this
    const {pCategoryId,categoryId,imgs,detail} = product
    //用于接收级联分类ID的数组
    const categoryIds = []
    if(isUpdate){
      //一级
      if(pCategoryId === '0'){
        categoryIds.push(categoryId)
      }else{
      //二级
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    const {getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: { span: 2 }, //左侧label的宽度
      wrapperCol: { span: 8 },//右侧label的宽度
    }

    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type = 'arrow-left' style={{fontSize:20}}  />
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label= '商品名称'>
            {
              getFieldDecorator(
               'name',
               {
                initialValue:product.name,
                rules:[
                  {required:true,message:'商品名称必须输入'}
                ]
               }
              )(
                <Input placeholder='请输入商品名称'/>
              )
            }
          </Item>

          <Item label= '商品描述'>
            {
                getFieldDecorator(
                'desc',
                {
                  initialValue:product.desc,
                  rules:[
                    {required:true,message:'商品描述必须输入'}
                  ]
                }
                )(
                  <TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 8 }} />
                )
              }
          </Item>

          <Item label= '商品价格'>
             {
                getFieldDecorator(
                'price',
                {
                  initialValue:product.price,
                  rules:[
                    {required:true,message:'商品价格必须输入'},
                    {validator: this.validatePrice}
                  ]
                }
                )(
                  <Input type = 'number' placeholder="请输入商品价格"  addonAfter="元"/>
                )
              }
          </Item>

          <Item label= '商品分类'>
             {
                getFieldDecorator(
                'categoryIds',
                {
                  initialValue:categoryIds,
                  rules:[
                    {required:true,message:'商品分类必须输入'},
                  ]
                }
                )(
                  <Cascader
                    placeholder='请指定商品分类'
                    options={this.state.options}
                    loadData={this.loadData}
                  />
                )
              }
            
          </Item>

          <Item label= '商品图片'>
            <PicturesWall  ref={this.pw} imgs={imgs}/>
          </Item>

          <Item label= '商品详情'  labelCol= {{ span: 2 }} wrapperCol={{span : 20}}>
            {/* labelCol: { span: 2 }, //左侧label的宽度
               wrapperCol: { span: 8 },//右侧label的宽度 */}
            <RichTextEditor ref={this.editor}  detail={detail}/>
          </Item> 

          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>


        </Form>

      </Card>
      
    )
  }
}

export default Form.create()(ProductAddUpdate)
/* 
子组件调用父组件的方法：将父组件的方法以函数的形式传递给子组件，子组件就可以调用
父组件调用子组件的方法：在父组件中通过ref得到子组件的标签对象（也就是组件对象），调用其方法
*/