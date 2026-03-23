#include<iostream>
#include<list>
using namespace std;

int main()
{
    list<int> myList;
    myList.push_back(10);
    myList.push_back(20);
    myList.push_back(30);
    myList.push_back(40);

    myList.push_front(50);
    myList.push_front(5);

    myList.pop_front();
    myList.pop_back();

    myList.push_back(10);

    //cout<<myList.size();
    //cout<<myList.front();
    //cout<<myList.back();

    //Traversing
    list<int>::iterator it =myList.begin();
    while(it!=myList.end()){
        cout<<*it<<" ";
        it++;

    }cout<<endl;


    myList.remove(10);
    myList.insert(myList.begin(),1);

    list<int>::iterator it2 =myList.begin();
    while(it2!=myList.end()){
        cout<<*it2<<" ";
        it2++;

    }cout<<endl;



    //if(myList.empty()==true){...}


    //first.swap(second);

    return 0;
}