# -*- coding: utf-8 -*-

import os
import shutil
import datetime
import re
from shutil import copyfile

release_dir = "./../release"

#删除所有非meta文件
if (os.path.exists(release_dir)):
    # shutil.rmtree(output_dir)
    for dirpath, dirnames, filenames in os.walk(release_dir):
        for filename in filenames:
            if not filename.endswith(".meta"):
                # print("to remote %s" % os.path.join(dirpath, filename))
                os.remove(os.path.join(dirpath, filename))


cur_path = os.path.realpath(__file__)
cur_path = os.path.dirname(cur_path)
print("target dir is " + cur_path)

#编译内部版本
os.system("tsc")
#编译外部版本
os.system("tsc -p ./tsconfig_pub.json")


#copy 所有js文件
for dirpath, dirnames, filenames in os.walk(cur_path):
    for filename in filenames:
        if filename.endswith(".js"):
            from_file = os.path.join(dirpath, filename)
            to_file = from_file.replace("/ts/", "/release/gamecore/")
            copyfile(from_file, to_file);

#copy rank文件到子域项目
copy_dir = "./../test_sub/assets/Script/rank"
if os.path.exists(copy_dir):
    shutil.rmtree(copy_dir)
shutil.copytree(os.path.join(release_dir, "gamecore/wechat/rank"), copy_dir)