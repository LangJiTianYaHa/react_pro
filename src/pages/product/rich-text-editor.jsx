/* 
用来指定商品详情的富文本编辑器  

*/
import React, { Component } from "react"
import PropTypes from "prop-types"
import { EditorState, convertToRaw, ContentState } from "draft-js"
import { Editor } from "react-draft-wysiwyg"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

export default class RichTextEditor extends Component {
  static propTypes = {
    detail: PropTypes.string,
  }

  state = {
    //创建一个没有内容的编辑对象
    editorState: EditorState.createEmpty(),
  }

  constructor(props) {
    super(props)
    const html = this.props.detail
    if (html) {
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        )
        const editorState = EditorState.createWithContent(contentState)
        this.state = {
          editorState,
        }
      }
    } else {
      this.state = {
        //创建一个没有内容的编辑对象
        editorState: EditorState.createEmpty(),
      }
    }
  }

  getDetail = () => {
    //返回输入数据对应得HTML格式的文本
    return draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    )
  }

  uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "/manage/img/upload")
      const data = new FormData()
      data.append("image", file)
      xhr.send(data)
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText)
        const url = response.data.url //得到图片的URL
        resolve({
          data: {
            link: url,
          },
        })
      })
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText)
        reject(error)
      })
    })
  }

  /* 
  输入过程中实时的回调
  */
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  render() {
    const { editorState } = this.state
    return (
      <Editor
        editorState={editorState}
        editorStyle={{
          border: "1px solid black",
          minHeight: 200,
          paddingLeft: 10,
        }}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: {
            uploadCallback: this.uploadImageCallBack,
            alt: { present: true, mandatory: true },
          },
        }}
      />
    )
  }
}
