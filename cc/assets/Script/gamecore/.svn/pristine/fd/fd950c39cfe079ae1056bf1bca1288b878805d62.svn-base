# -*- coding: utf-8 -*-

import os
import shutil
import datetime



output_dir = "./../test/assets/Script/gamecore"


#删除所有非meta文件
if (os.path.exists(output_dir)):
    # shutil.rmtree(output_dir)
    for dirpath, dirnames, filenames in os.walk(output_dir):
        for filename in filenames:
            if not filename.endswith(".meta"):
                # print("to remote %s" % os.path.join(dirpath, filename))
                os.remove(os.path.join(dirpath, filename))


cur_path = os.path.realpath(__file__)
cur_path = os.path.dirname(cur_path)
print("target dir is " + cur_path)

os.system("tsc")


#copy files

#copy所有js文件
for dirpath, dirnames, filenames in os.walk(cur_path):
    for filename in filenames:
        if filename.endswith(".js"):
            from_file = os.path.join(dirpath, filename)
            to_file = from_file.replace("/ts/", "/test/assets/Script/gamecore/")
            to_file_dir = os.path.dirname(to_file)
            if not os.path.exists(to_file_dir):
                os.makedirs(to_file_dir)
            shutil.copy(from_file, to_file)

#copy rank文件到子域项目
copy_dir = "./../test_sub/assets/Script/rank"
if os.path.exists(copy_dir):
    shutil.rmtree(copy_dir)
shutil.copytree("./../test/assets/Script/gamecore/wechat/rank", copy_dir)