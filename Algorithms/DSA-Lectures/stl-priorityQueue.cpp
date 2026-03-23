#include<iostream>
#include<queue>
using namespace std;

int main()
{
    priority_queue<int> pq;
    //max-heap -> max value -> Highest Priority

    pq.push(10);
    pq.push(25);
    pq.push(55);
    pq.push(21);
    //55,25,21,10

    //top element -> Highest Priority

    cout<<pq.top()<<endl;

    pq.pop();

    cout<<pq.top()<<endl;


    //if(pq.empty()==true)
    return 0;

    //MIN-HEAP
    priority_queue<int,vector<int>, greater<int> > pq;
    //min-value -> Highest Priority
}