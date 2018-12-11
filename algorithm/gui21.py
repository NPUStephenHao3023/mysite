# -*- coding: utf-8 -*-
"""
Created on Thu Oct 11 11:24:23 2018

@author: admin
"""

import pandas as pd
import tkinter
import numpy as np
from PIL import Image, ImageTk
import matplotlib.pyplot as plt
import equal_grid
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.backends.backend_tkagg import NavigationToolbar2TkAgg
import kdtree
import equal_3d
from mpl_toolkits.mplot3d import Axes3D
import kdtree_3
import hebing
import time_space
import sapce_time
#matplotlib.use('TkAgg')


#  信息熵 的计算
def calc_ent(x):
    x_value_list = set([x[i] for i in range(x.shape[0])])
    ent = 0.0
    for x_value in x_value_list:
        p = float(x[x == x_value].shape[0]) / x.shape[0]
        logp = np.log2(p)
        ent -= p * logp
    return ent
def func_menu():
    print("***菜单***")
    win = tkinter.Tk()
    win.title("说明文档")
    win.geometry("600x600+200+100") 
    text = tkinter.Text(win, width=80, height=40)
    text.pack()

    str = '''时空多粒度划分系统1.0
        Created on Thu Oct 11 11:24:23 2018

        @author: admin
    
    在线版：程序在线运行
    dataset:时间/经度/纬度
            dataset1/dataset2
            
    参数说明：
    
        二维等网格参数：lon和lat各轴上划分的网格个数
        空间kdtree参数：kdtree深度
        三维等网格参数：lon、lat和time各轴上划分的网格个数
        三维kdtree参数：3dtree深度
        三维细分合并参数：可视化图的个数
        先时间再空间参数：时间域划分粒度、空间域划分粒度
        先空间再时间参数：空间域划分粒度、时间域划分粒度
    
    操作步骤：先选数据集再选方法，然后修改参数点运行即可。。
    
        '''
    text.insert(tkinter.INSERT, str)
def updata():
    print(r.get())  
    if r.get()==1:
        data = np.array(pd.read_csv('.\\dataset\\dataset1.csv',header=None) )
        print(data[:5,:])
    if r.get()==2:
        data = np.array(pd.read_csv('.\\dataset\\dataset2.csv',header=None) )
        print(data[:5,:])
    return data
def updataff():
    print(ff.get())  

def draw_fig2():
    # 电视框
    '''
    tv = Image.open("tv.png")
    tkImage = ImageTk.PhotoImage(image=tv)
    label = tkinter.Label(root, image=tkImage)
    label.place(x=300,y=100,)'''
    #画出网格图
    if r.get()==1:
        df =  np.array(pd.read_csv('.\\dataset\\dataset1.csv',header=None) )
    if r.get()==2:
        df =  np.array(pd.read_csv('.\\dataset\\dataset2.csv',header=None) )
    fig = plt.Figure()
    canvas = FigureCanvasTkAgg(fig, master=root)
    canvas.get_tk_widget().place(x=325,y=125)
    toolbar = NavigationToolbar2TkAgg(canvas, root)
    toolbar.update()
    toolbar.place(x=300,y=70)
    if ff.get()==1:
        
        sp = int(f11.get() )
        ax = fig.add_subplot(111)
        equal_grid.equal_grid(ax,df,sp)
        grid_num = equal_grid.state_grid(df,sp)
        hp.set(str(calc_ent(np.array(grid_num)) ))
        s2.set(str(np.var(grid_num)) )
        guideline3.set(str(np.std(grid_num)))
        guideline4.set(str(np.mean(grid_num)))
        guideline5.set(str(np.min(grid_num)))
        guideline6.set(str(np.max(grid_num)))
        guideline9.set(str(len(grid_num)))
        guideline7.set(str(pd.Series(grid_num).skew() ))
        guideline8.set(str(pd.Series(grid_num).kurt() ))
    if ff.get()==2:
        sp = int(f22.get())
        ax = fig.add_subplot(111)
        grid_num = kdtree.draw_fig(df,ax,sp)
        print( grid_num)
        hp.set(str(calc_ent(np.array( grid_num)) ))
        s2.set(str(np.var( grid_num)) )
        guideline3.set(str(np.std(grid_num)))
        guideline4.set(str(np.mean(grid_num)))
        guideline5.set(str(np.min(grid_num)))
        guideline6.set(str(np.max(grid_num)))
        guideline9.set(str(len(grid_num)))
        guideline7.set(str(pd.Series(grid_num).skew() ))
        guideline8.set(str(pd.Series(grid_num).kurt() ))
    if ff.get()==3:
        sp = int(f31.get())
        ax = Axes3D(fig)
        equal_3d.draw_fig(df,ax,sp)
        grid_num = equal_3d.state_num(df,sp)
        hp.set(str(calc_ent(np.array(grid_num)) ))
        s2.set(str(np.var(grid_num)) )
        guideline3.set(str(np.std(grid_num)))
        guideline4.set(str(np.mean(grid_num)))
        guideline5.set(str(np.min(grid_num)))
        guideline6.set(str(np.max(grid_num)))
        guideline9.set(str(len(grid_num)))
        guideline7.set(str(pd.Series(grid_num).skew() ))
        guideline8.set(str(pd.Series(grid_num).kurt() ))
    if ff.get()==4:
        sp = int(f41.get())
        ax = fig.gca(projection='3d')
        grid_num = kdtree_3.draw_fig(df,sp,ax)
        hp.set(str(calc_ent(np.array(grid_num)) ))
        s2.set(str(np.var(grid_num)) )
        guideline3.set(str(np.std(grid_num)))
        guideline4.set(str(np.mean(grid_num)))
        guideline5.set(str(np.min(grid_num)))
        guideline6.set(str(np.max(grid_num)))
        guideline9.set(str(len(grid_num)))
        guideline7.set(str(pd.Series(grid_num).skew() ))
        guideline8.set(str(pd.Series(grid_num).kurt() ))
    if ff.get()==5:
        sp = int(f51.get())
        #hebing.xifen(df,xs = 50,ys = 50,zs = 30)  # 细分
        #hebing.hebing2(df)                        # 合并
        grid_num = hebing.state_num()
        hebing.draw_fig(df,sp,fig)
        hp.set(str(calc_ent(np.array(grid_num))))
        s2.set(str(np.var(grid_num)) )
        guideline3.set(str(np.std(grid_num)))
        guideline4.set(str(np.mean(grid_num)))
        guideline5.set(str(np.min(grid_num)))
        guideline6.set(str(np.max(grid_num)))
        guideline9.set(str(len(grid_num)))
        guideline7.set(str(pd.Series(grid_num).skew() ))
        guideline8.set(str(pd.Series(grid_num).kurt() ))
    if ff.get()==6:
        sp1 = int(f61.get())
        sp2 = int(f62.get())
        grid_num = time_space.draw_fig(df,sp1,sp2,fig)
        hp.set(str(calc_ent(np.array(grid_num))))
        s2.set(str(np.var(grid_num)) )
        guideline3.set(str(np.std(grid_num)))
        guideline4.set(str(np.mean(grid_num)))
        guideline5.set(str(np.min(grid_num)))
        guideline6.set(str(np.max(grid_num)))
        guideline9.set(str(len(grid_num)))
        guideline7.set(str(pd.Series(grid_num).skew() ))
        guideline8.set(str(pd.Series(grid_num).kurt() ))
    if ff.get()==7:
        sp1 = int(f71.get())
        sp2 = int(f72.get())
        grid_num = sapce_time.draw_f7(df,sp1,sp2,fig)
        hp.set(str(calc_ent(np.array(grid_num))))
        s2.set(str(np.var(grid_num)) )
        guideline3.set(str(np.std(grid_num)))
        guideline4.set(str(np.mean(grid_num)))
        guideline5.set(str(np.min(grid_num)))
        guideline6.set(str(np.max(grid_num)))
        guideline9.set(str(len(grid_num)))
        guideline7.set(str(pd.Series(grid_num).skew() ))
        guideline8.set(str(pd.Series(grid_num).kurt() ))


root  = tkinter.Tk()
X = 1300
Y = 700
root.geometry(str(X)+'x'+str(Y)+"+100+50")
root.iconbitmap('logo.ico')
root.title('时空多粒度描述_3.0')
root.attributes('-toolwindow', True,)
hp =  tkinter.StringVar()  # 信息熵
s2 =  tkinter.StringVar()  # 方差

guideline3 =  tkinter.StringVar()  # 标准差
guideline4 =  tkinter.StringVar()  #  均值
guideline5 =  tkinter.StringVar()  # 最小值
guideline6 =  tkinter.StringVar()  # 最大值
guideline7 =  tkinter.StringVar()  #  偏度
guideline8 =  tkinter.StringVar()  # 峰度
guideline9 =  tkinter.StringVar()  # 数目

#  菜单栏
menubar = tkinter.Menu(root)
root.config(menu=menubar)
# 创建文件下拉菜单
filemenu = tkinter.Menu(menubar, tearoff=0)
menubar.add_cascade(label="菜单", menu=filemenu)
'''
filemenu.add_command(label="新建···")
filemenu.add_command(label="打开···")
filemenu.add_command(label="保存")
'''
filemenu.add_command(label="关闭",command=root.quit)


 
filemenu1 = tkinter.Menu(menubar, tearoff=1)
menubar.add_cascade(label="帮助", menu=filemenu1)
filemenu1.add_command(label="说明文档",command=func_menu)
# 背景图片
cv0 = tkinter.Canvas(root,bg='dodgerblue')#  顶部背景
cv0.place(x=0,y=0,height=65,width=1300)

pilImage = Image.open("logo.png")
tkImage = ImageTk.PhotoImage(image=pilImage)
label = tkinter.Label(root, image=tkImage)
label.place(x=0,y=0)
# 背景框

cv = tkinter.Canvas(root,bg='lightskyblue')#  左边画布背景     lightskyblue
cv.create_rectangle(10,100,280,560)
cv.create_rectangle(10,30,100,80,)
cv.place(x=0,y=63,height=700,width=300)

cv1 = tkinter.Canvas(root,bg='lightskyblue') # 右边画布背景    lightskyblue
cv1.create_rectangle(10,100,280,560)
cv1.create_rectangle(10,30,100,80)
cv1.place(x=1000,y=63,height=700,width=300)


# 标题
root["bg"] = "white"  #  grey
title0 = tkinter.Label(root, text='时空语义多粒度结构化描述'
                       ,font=('楷体',22), fg='black',bg='dodgerblue')
title0.place(x=65,y=2,height=60)
# 数据集选择
shujuji = tkinter.Label(root,text='数据集',font=('楷体',15),fg='black',bg='lightskyblue')
shujuji.place(x=15,y=100)

r = tkinter.IntVar()
data = np.zeros((1,3))

#  数据集        
radio1 = tkinter.Radiobutton(root, text="dataset1", value=1, variable=r, command=updata,
                             bg='lightskyblue')
radio1.place(x=130,y=90)
radio2 = tkinter.Radiobutton(root, text="dataset2", value=2, variable=r, command=updata,
                             bg='lightskyblue')
radio2.place(x=130,y=120)

# 方法
ff = tkinter.IntVar()
ff.set(1)
fig_path = tkinter.StringVar()


radio4 = tkinter.Radiobutton(root, font=('楷体',10),text="二维等网格", bg='lightskyblue',
                             relief='sunken',value=1, variable=ff, command=updataff,)
radio4.place(x=30,y=210)
radio5 = tkinter.Radiobutton(root, font=('楷体',10),text="空间kdtree", bg='lightskyblue',
                              relief='sunken',value=2, variable=ff, command=updataff)
radio5.place(x=30,y=260)
radio6 = tkinter.Radiobutton(root, font=('楷体',10),text="三维等网格", bg='lightskyblue',
                             relief='sunken',fg='black',value=3, variable=ff, command=updataff)
radio6.place(x=30,y=310)
radio7 = tkinter.Radiobutton(root, font=('楷体',10),text="三维kdtree", bg='lightskyblue',
                             relief='sunken',value=4, variable=ff, command=updataff)
radio7.place(x=30,y=360)
radio6.place(x=30,y=310)
radio8 = tkinter.Radiobutton(root, font=('楷体',10),text="三维细分合并", bg='lightskyblue',
                             relief='sunken',value=5, variable=ff, command=updataff)
radio8.place(x=30,y=410)
radio9 = tkinter.Radiobutton(root, font=('楷体',10),text="先时间再空间", bg='lightskyblue',
                             relief='sunken',value=6, variable=ff, command=updataff)
radio9.place(x=30,y=460)
radio9 = tkinter.Radiobutton(root, font=('楷体',10),text="先空间再时间", bg='lightskyblue',
                             relief='sunken',value=7, variable=ff, command=updataff)
radio9.place(x=30,y=520)
# 方法的参数
f11 = tkinter.StringVar()  #  方法1 的参数
# 方法1
def updataf11():
    print(f11.get())
sp = tkinter.Spinbox(root, from_=5, to=30, increment=5,
                      textvariable=f11, command=updataf11)
sp.place(x=200,y=215,width=50)

# 方法2
f22 = tkinter.StringVar()  #  方法2 的参数
def updataf22():
    print(f22.get())
sp = tkinter.Spinbox(root, from_=2, to=10, increment=1,
                      textvariable=f22, command=updataf22)
sp.place(x=200,y=265,width=50)

# 方法3
f31 = tkinter.StringVar()  #  方法2 的参数
def updataf31():
    print(f31.get())
sp = tkinter.Spinbox(root, from_=2, to=20, increment=1,
                      textvariable=f31, command=updataf31)
sp.place(x=200,y=315,width=50)

# 方法4
f41 = tkinter.StringVar()  #  方法2 的参数
def updataf41():
    print(f41.get())
sp = tkinter.Spinbox(root, from_=2, to=10, increment=1,
                      textvariable=f41, command=updataf41)
sp.place(x=200,y=365,width=50)

# 方法5
f51 = tkinter.StringVar()  #  方法2 的参数
def updataf51():
    print(f51.get())
sp = tkinter.Spinbox(root, from_=1, to=100, increment=5,
                      textvariable=f51, command=updataf51)
sp.place(x=200,y=415,width=50)

# 方法6
f61 = tkinter.StringVar()  #  方法2 的参数
def updataf61():
    print(f61.get())
sp1 = tkinter.Spinbox(root, from_=2, to=24, increment=1,
                      textvariable=f61, command=updataf61)
sp1.place(x=200,y=455,width=50)
f62 = tkinter.StringVar()  #  方法2 的参数
def updataf62():
    print(f62.get())
sp2 = tkinter.Spinbox(root, from_=2, to=10, increment=1,
                      textvariable=f62, command=updataf62)
sp2.place(x=200,y=480,width=50)

# 方法7
f71 = tkinter.StringVar()  #  方法7 的参数
def updataf71():
    print(f71.get())
sp1 = tkinter.Spinbox(root, from_=3, to=24, increment=1,
                      textvariable=f71, command=updataf71)
sp1.place(x=200,y=515,width=50)
f72 = tkinter.StringVar()  #  方法7 的参数
def updataf72():
    print(f72.get())
sp2 = tkinter.Spinbox(root, from_=3, to=10, increment=1,
                      textvariable=f72, command=updataf72)
sp2.place(x=200,y=540,width=50)
#设置图形尺寸与质量



        
tkinter.Button(root,text='运行',bg='lightcyan',activebackground='red',activeforeground='blue',
               command=draw_fig2).place(x=950,y=630)
       


#  信息熵 及 方差的显示
zhibiao = tkinter.Label(root,text='指标',font=('楷体',15),fg='black',background='lightskyblue')
zhibiao.place(x=1022,y=100)
label2 = tkinter.Label(root,text='信息熵:',font=('楷体',10),fg='black',background='lightskyblue')
label2.place(x=1020,y=200)
label3 = tkinter.Label(root,text='方差:',font=('楷体',10),background='lightskyblue')
label3.place(x=1020,y=240) 
label6 = tkinter.Label(root,text='标准差:',font=('楷体',10),background='lightskyblue')
label6.place(x=1020,y=280) 
label7 = tkinter.Label(root,text='均值:',font=('楷体',10),background='lightskyblue')
label7.place(x=1020,y=320) 
label8 = tkinter.Label(root,text='最小值:',font=('楷体',10),background='lightskyblue')
label8.place(x=1020,y=360) 
label9 = tkinter.Label(root,text='最大值:',font=('楷体',10),background='lightskyblue')
label9.place(x=1020,y=400) 
label10 = tkinter.Label(root,text='偏度:',font=('楷体',10),background='lightskyblue')
label10.place(x=1020,y=440) 
label11 = tkinter.Label(root,text='峰度:',font=('楷体',10),background='lightskyblue')
label11.place(x=1020,y=480) 
label12 = tkinter.Label(root,text='数目:',font=('楷体',10),background='lightskyblue')
label12.place(x=1020,y=520) 


label5 = tkinter.Label(root,font = ('微软雅黑',10),bg = 'lightskyblue',textvariable = hp,)
label5.place(x=1100,y = 200,width = 150,height =30)
label4 = tkinter.Label(root,font = ('微软雅黑',10),bg = 'lightskyblue',textvariable = s2)     
label4.place(x=1100,y = 240,width = 150,height =30)

label13 = tkinter.Label(root,font = ('微软雅黑',10),bg ='lightskyblue',textvariable = guideline3)
label13.place(x=1100,y = 280,width = 150,height =30) #  标准差
label14 = tkinter.Label(root,font = ('微软雅黑',10),bg = 'lightskyblue',textvariable = guideline4)     
label14.place(x=1100,y = 320,width = 150,height =30) # 均值
label15 = tkinter.Label(root,font = ('微软雅黑',10),bg = 'lightskyblue',textvariable = guideline5)
label15.place(x=1100,y = 360,width = 150,height =30)# 最小值
label16 = tkinter.Label(root,font = ('微软雅黑',10),bg = 'lightskyblue',textvariable = guideline6)     
label16.place(x=1100,y = 400,width = 150,height =30)# 最大值
label17 = tkinter.Label(root,font = ('微软雅黑',10),bg = 'lightskyblue',textvariable = guideline7)
label17.place(x=1100,y = 440,width = 150,height =30)# 偏度
label18 = tkinter.Label(root,font = ('微软雅黑',10),bg = 'lightskyblue',textvariable = guideline8)     
label18.place(x=1100,y = 480,width = 150,height =30)# 峰度
label19 = tkinter.Label(root,font = ('微软雅黑',10),bg = 'lightskyblue',textvariable = guideline9)
label19.place(x=1100,y = 520,width = 150,height =30) # 数目


# 右下角的显示框
'''
result = tkinter.StringVar() # 显示
result.set(' ')  
label20 = tkinter.Label(root,text='方法:',font=('微软雅黑',15),fg='black')
label20.place(x=1068,y=600) 
label1 = tkinter.Label(root,font = ('微软雅黑',15),bg = 'white',bd ='9',wraplength=200,
                     fg = '#828282',anchor = 'e',textvariable = ff)
label1.place(x=1130,y = 600,width = 50,height =38)
'''
root.mainloop()

