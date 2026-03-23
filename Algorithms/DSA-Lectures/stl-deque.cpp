#include<iostream>
#include<queue>
using namespace std;

int main()
{
    deque<int> dq;

    dq.push_back(10);
    //10
    dq.push_back(20);
    //10,20
    dq.push_back(40);
    //10,20,40
    dq.push_front(100);
    //100,10,20,40
    dq.push_front(200);
    //200,100,10,20,40
    dq.push_front(300);
    //300,200,100,10,20,40

    dq.pop_front();
    dq.pop_back();

    cout<<dq.size()<<endl;
    cout<<dq.front()<<endl;
    cout<<dq.back()<<endl;

    deque<int>::iterator it=dq.begin();
    while(it!=dq.end()){
        cout<<*it<<" ";
        it++;
    }

    //if(dq.empty()==true){...}
    //dq[]=...
    //dq.at(n)=

    //dq.clear()
    //dq.insert(dq.begin(),101);
    //dq.erase(start,end);
    return 0;
}