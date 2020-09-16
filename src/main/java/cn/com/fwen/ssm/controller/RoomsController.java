package cn.com.fwen.ssm.controller;

import cn.com.fwen.ssm.entity.Rooms;
import cn.com.fwen.ssm.utils.QiniuUploadUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 *   客房控制器层
 */

@Controller
@RequestMapping("/rooms")
public class RoomsController extends BaseController<Rooms> {

//    //客房封面图上传
//    @RequestMapping("/uploadRoomPic")
//    public @ResponseBody Map<String,Object> uploadRoomPic(String path, MultipartFile myFile){
//        return FileUploadUtils.upload(path,myFile);  //调用工具类执行上传
//    }

    //客房封面图上传
    @RequestMapping("/uploadRoomPic")
    public @ResponseBody Map<String,Object> uploadRoomPic(MultipartFile myFile) throws IOException {
        return QiniuUploadUtils.upload(myFile); //调用七牛云工具类执行上传
    }
}
