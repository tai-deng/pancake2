import _default_vert = require("./base/ccShader_Default_Vert.js");
import _default_vert_no_mvp = require("./base/ccShader_Default_Vert_noMVP.js");
import _blur_edge_detail_frag = require("./ccShaderBlurEdgeFrag.js");

const {ccclass, property} = cc._decorator;

@ccclass
export default class Comp_ShaderBlurEdge extends cc.Component {

    private _program:any;

    onLoad () {
        this._use();
    }

    private _use():void {
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram")
            this._program.initWithString(_default_vert_no_mvp, _blur_edge_detail_frag);
            this._program.link();
            this._program.updateUniforms();
        }else{
            this._program.initWithVertexShaderByteArray(_default_vert, _blur_edge_detail_frag);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }
        
        let _uniWidthStep:any = this._program.getUniformLocationForName( "widthStep" );
        let _uniHeightStep:any = this._program.getUniformLocationForName( "heightStep" );
        let _uniStrength:any = this._program.getUniformLocationForName( "strength" );

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat( _uniWidthStep , ( 1.0 / this.node.getContentSize().width ) );
            glProgram_state.setUniformFloat( _uniHeightStep , ( 1.0 / this.node.getContentSize().height ) );
            glProgram_state.setUniformFloat(  _uniStrength, 1.0 );
        }else{
            this._program.setUniformLocationWith1f( _uniWidthStep, ( 1.0 / this.node.getContentSize().width ) );
            this._program.setUniformLocationWith1f( _uniHeightStep, ( 1.0 / this.node.getContentSize().height ) );
            
            /* 模糊 0.5     */
            /* 模糊 1.0     */
            /* 细节 -2.0    */
            /* 细节 -5.0    */
            /* 细节 -10.0   */
            /* 边缘 2.0     */
            /* 边缘 5.0     */
            /* 边缘 10.0    */
            this._program.setUniformLocationWith1f( _uniStrength, 1.0 );
        }
        
        this.setProgram( (this.node as any)._sgNode);
    }



    private setProgram(node:any):void {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            node.setGLProgramState(glProgram_state);
        }else{
            node.setShaderProgram(this._program);    
        }
    
        var children = node.children;
        if (!children) return;
    
        for (var i = 0; i < children.length; i++) {
            (this as any).setProgram(children[i], this._program);
        }
    }

}
