#!/usr/bin/env python

import cgi, os, re, sys
import cgitb;cgitb.enable()
import json
import pandas as pd
import numpy as np
import pymysql
#import time

#start_time = time.time()

# form = cgi.FieldStorage()
# jsons = form.getvalue('jsons')
# sampleID = json.loads(jsons)
# organism = form.getvalue('organism')
# sessionid = form.getvalue('sessionid')
# host = form.getvalue('host')
# port = form.getvalue('port')
# user = form.getvalue('user')
# passwd = form.getvalue('passwd')
# unix_socket = form.getvalue('unix_socket')
# upper_limit = float(form.getvalue('upper_limit'))
# lower_limit = float(form.getvalue('lower_limit'))

#sampleID = ['RPE-21-3-c1','RPE-21-3-c2','RPE-21-3-c1-p']

sampleID = {'group2':['HCT116-21-3-c1', 'HCT116-21-3-c3', 'HCT116-5-4', 'HCT116-5-4-p'],'group1':['HCT116-8-3-c3', 'HCT116-8-3-c4', 'RPE-21-3-c1', 'RPE-21-3-c1-p','RPE-21-3-c2', 'RPE-5-3-12-3-p']}
sessionid= "test"
organism = "Human"
host = "localhost"
port = 3306
user = "root"
passwd = ""
unix_socket = "/tmp/mysql.sock"
upper_limit = 2
lower_limit = -2



isGroup = isinstance(sampleID, dict)

if (isGroup):
    sampleID_index = pd.DataFrame({'samples' : sampleID})
    sampleID_index['sampleID'] = sampleID_index.index
    sampleID_index = sampleID_index.reset_index()
    sampleID_index['index']=sampleID_index.index
    sampleID_index.drop('samples',axis=1,inplace=True)
else:
    sampleID_index = pd.DataFrame({'sampleID' : sampleID})
    sampleID_index['sampleID_index'] = sampleID_index.index


if (isGroup):
    grouping = pd.DataFrame()
    for group in sampleID:
        grouping_tmp = pd.DataFrame(np.array(sampleID[group]), columns = ["sampleID"])
        grouping_tmp['group'] = group
        if grouping.empty:
            grouping = grouping_tmp
        else:
            grouping = pd.concat([grouping,grouping_tmp])
    
    grouping.drop_duplicates(subset='sampleID', keep="first")
    sampleID = grouping['sampleID']

#connecting to mysql database
conn = pymysql.connect(host=host, port=port, user=user, passwd=passwd, db=organism, unix_socket=unix_socket)
query = 'SELECT target_exp.sampleID, target_exp.gene, target_exp.log2, target_exp.pvalue, target_mut.mutation FROM target_exp LEFT JOIN target_mut ON target_exp.sampleID=target_mut.sampleID AND target_exp.gene=target_mut.gene WHERE target_exp.sampleID in ('+','.join(map("'{0}'".format, sampleID))+') AND target_exp.userID in ("mitox","'+sessionid+'")'
main = pd.read_sql(query, con=conn)
query2 = 'SELECT gene, process from target'
genefunc = pd.read_sql(query2, con=conn)
conn.close()

main = main.drop(main[(main.log2 > upper_limit) | (main.log2 < lower_limit)].index)

if (isGroup):
    main = pd.merge(main,grouping,on='sampleID',how='inner')
    log2 = main.groupby(['group','gene'])['log2'].mean().unstack('group')
    log2.reset_index(inplace=True)
    log2 = pd.melt(log2,id_vars=['gene'],var_name='sampleID', value_name='log2')
    mutation = main.groupby(['group','gene'])['mutation'].count().unstack('group')
    mutation.reset_index(inplace=True)
    mutation = pd.melt(mutation,id_vars=['gene'],var_name='sampleID', value_name='mutation')
    main = pd.merge(log2,mutation,how='left', on=['gene','sampleID'])
    main['pvalue']=1
    main['mutation'].fillna(0,inplace=True)
    main['mutation'] = main['mutation'].astype(int).astype(str) + ' mutation(s)'

main.fillna('',inplace=True)
main = pd.merge(genefunc,main,on="gene",how='inner') 
main = pd.merge(sampleID_index,main,on="sampleID",how='outer')    
main.sort_values(["gene","sampleID"], inplace=True)
main = main.to_json(orient='records')

# print 'Content-Type: application/json\n\n'
# print (main)
print "Content-type: text/html\n"
print "<html>"
print sampleID_index
print "</html>"