#include<iostream>
#include<queue>
using namespace std;

int main()
{
    //creation
    queue<int> q;
    q.push(10);
    //10
    q.push(20);
    //10,20
    q.push(30);
    //10,20,30
    q.push(40);
    //10,20,30,40


    cout<<q.size()<<endl;
    //q.clear();

    q.pop();
    //20,30,40
    cout<<q.size()<<endl;

    cout<<q.front()<<" "<<q.back()<<endl;

    //if(q.empty()==true){...}
    //q.swap(p)
    return 0;
}