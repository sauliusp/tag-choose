import subprocess, json, re, concurrent.futures, os
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
BASE=os.environ.get('TAGCHOOSE_QA_BASE_URL', 'https://tagchoose.site').rstrip('/')
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.canonical=[];self.h1=0;self.description=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='a' and a.get('href','').startswith('/'):self.links.append(a['href'].split('#')[0])
  if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a['href'])
  if tag=='h1':self.h1+=1
  if tag=='meta' and a.get('name')=='description':self.description=a.get('content')
def fetch(path):
 p=subprocess.run(['curl','-sS','--max-time','30','-w','\n%{http_code}',BASE+path],capture_output=True,text=True,check=True)
 body,status=p.stdout.rsplit('\n',1);return body,int(status)
sm,status=fetch('/sitemap.xml');assert status==200,(status,sm[:100])
paths=[urlparse(x).path for x in re.findall(r'<loc>(.*?)</loc>',sm)]
assert len(paths)>=10,len(paths)
def check(path):
 body,status=fetch(path);doc=Page();doc.feed(body)
 assert status==200,(path,status)
 assert doc.h1==1,(path,doc.h1)
 assert doc.description,(path,'description')
 assert [x.rstrip('/') for x in doc.canonical]==[urljoin('https://tagchoose.site',path).rstrip('/')],(path,doc.canonical)
 assert 'Petreikis' not in body,(path,'full name')
 assert not re.search(r'https?://[^\s"<>]*chatgpt\.site',body),(path,'hosting address in public page')
 return {'path':path,'status':status,'canonical':doc.canonical[0],'h1':doc.h1,'links':doc.links}
results=list(concurrent.futures.ThreadPoolExecutor(max_workers=4).map(check,paths))
for path in sorted(set(l for r in results for l in r['links'] if l and l not in paths)):
 _,status=fetch(path);assert status==200,(path,status)
_,missing=fetch('/tagchoose-qa-nonexistent-page/');assert missing==404,missing
robots,status=fetch('/robots.txt');assert status==200 and 'https://tagchoose.site/sitemap.xml' in robots
open('qa/release/website-http.json','w').write(json.dumps({'routes':results,'missing_page_status':missing,'robots':robots},indent=2))
print(f'{len(results)} public routes: HTTP 200, one H1, descriptions, correct canonicals; internal links, sitemap, robots and real 404 passed.')
